#!/usr/bin/env python3
"""Prepare a generated WAV for quiet, continuous website playback (requires FFmpeg)."""
import argparse
import json
import math
from pathlib import Path
import re
import subprocess
import tempfile


def run(ffmpeg, *args):
    return subprocess.run([ffmpeg, "-hide_banner", "-nostdin", *map(str, args)], check=True, capture_output=True, text=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    parser.add_argument("--start", type=float, default=4)
    parser.add_argument("--end", type=float, required=True, help="End of the selected passage, before its final fade-out")
    parser.add_argument("--crossfade", type=float, default=3.4)
    args = parser.parse_args()
    if args.output.exists():
        parser.error("Output already exists; choose a new path.")
    if args.start < 0 or args.crossfade <= 0 or args.end - args.start <= args.crossfade * 2:
        parser.error("Select a passage longer than twice the crossfade.")
    with tempfile.TemporaryDirectory(prefix="coastal-music-") as directory:
        loop = Path(directory) / "loop.wav"
        # Rotate the opening into the ending. The exported end and start are then
        # adjacent original samples; the musical transition happens in the fade.
        graph = (
            f"[0:a]atrim=start={args.start + args.crossfade}:end={args.end},asetpts=PTS-STARTPTS[body];"
            f"[1:a]atrim=start={args.start}:end={args.start + args.crossfade},asetpts=PTS-STARTPTS[head];"
            f"[body][head]acrossfade=d={args.crossfade}:c1=qsin:c2=qsin[out]"
        )
        run(args.ffmpeg, "-i", args.input, "-i", args.input, "-filter_complex", graph, "-map", "[out]", "-ar", "44100", "-c:a", "pcm_s24le", loop)
        report = run(args.ffmpeg, "-i", loop, "-af", "loudnorm=I=-19:TP=-3:LRA=7:print_format=json", "-f", "null", "-")
        stats = json.loads(re.search(r'\{\s*"input_i"[\s\S]*?\}', report.stderr).group())
        if not all(math.isfinite(float(stats[key])) for key in ("input_i", "input_tp")):
            parser.error("The selected passage has no measurable audio; no MP3 was written.")
        # A constant gain keeps the loop boundary intact and preserves dynamics.
        gain = min(-19 - float(stats["input_i"]), -3 - float(stats["input_tp"]))
        args.output.parent.mkdir(parents=True, exist_ok=True)
        run(args.ffmpeg, "-i", loop, "-af", f"volume={gain}dB", "-c:a", "libmp3lame", "-b:a", "160k", "-map_metadata", "-1", "-metadata", "title=海边慢骑", "-metadata", "comment=Instrumental generated with fun-music-v1; prepared for looping", args.output)
        print(json.dumps({
            "output": str(args.output), "duration_seconds": round(args.end - args.start - args.crossfade, 3),
            "crossfade_seconds": args.crossfade, "gain_db": round(gain, 2),
            "integrated_lufs": round(float(stats["input_i"]) + gain, 2),
            "true_peak_dbtp": round(float(stats["input_tp"]) + gain, 2),
            "bytes": args.output.stat().st_size,
        }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
