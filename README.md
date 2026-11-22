# news-image-20261121

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/JT-JIG/news-image-20261121/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard)
[![reward](https://make.fun/badge/news-image-20261121/JT-JIG/news-image-20261121/reward.svg)](https://make.fun/bounty/news-image-20261121)

One image that sums up Saturday 21 November 2026's world news — the day's seven biggest stories, laid out as a newspaper front page.

## The stories

- Russia's barrage on Ukraine spilling into Poland, with NATO's Rutte in Warsaw
- The Claude-aided Riemann proof passing Lean/Mathlib checks
- The AI sell-off dragging the S&P into correction
- COP31 running past its deadline
- Mexico capturing 'El Chapo Isidro'
- Iran striking a Bahrain site
- GTA VI's $3.79bn day one

## How it runs

`main.ts` checks that `entry.png` is a real PNG or JPEG under 1 MiB, then copies it to the output folder:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
