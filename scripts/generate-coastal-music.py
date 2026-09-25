#!/usr/bin/env python3
"""Generate the site's instrumental track with Fun-Music; never stores API keys.

Official API: https://www.alibabacloud.com/help/en/model-studio/fun-music-api
Instrumental mode: https://platform.qianwenai.com/docs/developer-guides/speech/music-generation
"""
import argparse
import json
import os
from pathlib import Path
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen

PROMPT = """创作一首适合网页阅读时低音量循环播放的纯器乐背景音乐，标题《海边慢骑》。
画面：一只戴绿色围巾的白色鹈鹕，骑着珊瑚色自行车，沿着柔和海岸线悠闲前行，云朵慢慢飘过。
速度约 70 BPM，4/4 拍，节奏轻盈舒缓，温暖、松弛、俏皮但不幼稚，带一点海风和午后阳光的感觉。
以柔和指弹尼龙弦木吉他为主，少量温润的 Rhodes 电钢琴、轻柔圆润的贝斯、极轻的沙锤和刷鼓。
使用简洁优美的短旋律与大七和弦，音符留白充足，低动态，避免强烈鼓点、音量突变、密集独奏和戏剧性高潮。
绝对不要人声、歌词、吟唱、哼鸣、口哨或旁白，也不要海浪、鸟鸣或车铃音效。
建议约 90 秒，同一速度与调性贯穿始终，开头和结尾保持相近的和声与织体，适合自然衔接循环。
整体像一段轻松的小旅行，安静陪伴阅读，不抢走注意力。"""


def read_key(env_file, key_file=None):
    key = os.environ.get("DASHSCOPE_API_KEY", "")
    if env_file:
        for line in Path(env_file).expanduser().read_text().splitlines():
            line = line.strip().removeprefix("export ")
            name, sep, value = line.partition("=")
            if sep and name.strip() == "DASHSCOPE_API_KEY":
                key = value.strip().strip('"\'')
                break
    if key_file:
        # Accept a plain key or Markdown note without copying it into the repo.
        candidates = set(re.findall(r"(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{16,}", Path(key_file).expanduser().read_text()))
        if len(candidates) != 1:
            sys.exit("The credential note must contain exactly one API key; no request was sent.")
        key = candidates.pop()
    if not key or key.startswith("sk-xxx"):
        sys.exit("Set DASHSCOPE_API_KEY or pass an external --env-file; no request was sent.")
    return key


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", help="External .env file containing DASHSCOPE_API_KEY")
    parser.add_argument("--key-file", help="External plain-text or Markdown note containing one API key")
    parser.add_argument("--response-cache", type=Path, help="Private temporary response file; reuse it to retry a download without regenerating")
    parser.add_argument("--output", required=True, type=Path, help="Destination WAV file")
    args = parser.parse_args()
    if args.output.exists():
        sys.exit("Output already exists; choose a new path to preserve the previous generation.")
    key = read_key(args.env_file, args.key_file)
    payload = {"model": "fun-music-v1", "input": {"prompt": PROMPT, "is_instrumental": True, "format": "wav"}}
    request = Request(
        "https://dashscope.aliyuncs.com/api/v1/services/audio/music/generation",
        data=json.dumps(payload, ensure_ascii=False).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    if args.response_cache and args.response_cache.exists():
        result = json.loads(args.response_cache.read_text())
        print("Resuming the existing generation's download...", flush=True)
    else:
        print("Generating one instrumental track with fun-music-v1...", flush=True)
        try:
            with urlopen(request, timeout=600) as response:
                result = json.load(response)
        except HTTPError as error:
            detail = error.read().decode(errors="replace").replace(key, "[redacted]")
            sys.exit(f"Generation failed: HTTP {error.code}: {detail[:800]}")
        except (URLError, TimeoutError) as error:
            sys.exit(f"Generation did not return a confirmed result ({type(error).__name__}); no automatic paid retry was made.")
        if args.response_cache:
            # Contains a temporary signed asset URL, never the API key.
            descriptor = os.open(args.response_cache, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(descriptor, "w") as cache:
                json.dump(result, cache)

    output = result.get("output", {})
    url = output.get("audio", {}).get("url")
    if not url:
        sys.exit(f"No audio returned. Request ID: {result.get('request_id', 'unknown')}")
    parts = urlsplit(url)
    if parts.scheme not in {"http", "https"} or not (parts.hostname or "").endswith(".aliyuncs.com"):
        sys.exit("Unexpected audio download host; output URL was not followed.")
    url = urlunsplit(parts._replace(scheme="https"))
    # The provider returns a short-lived URL. Save the asset, never hotlink it.
    with urlopen(url, timeout=180) as response:
        audio = response.read()
    if not audio.startswith(b"RIFF") or audio[8:12] != b"WAVE":
        sys.exit("The provider did not return the requested WAV format; no invalid asset was written.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(audio)
    metadata = {
        "title": "海边慢骑", "model": "fun-music-v1", "instrumental": True,
        "prompt": PROMPT, "request_id": result.get("request_id"),
        "duration_seconds": result.get("usage", {}).get("duration"),
        "extra_info": output.get("extra_info", {}),
    }
    args.output.with_suffix(".json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"saved": str(args.output), "bytes": len(audio), "duration": metadata["duration_seconds"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
