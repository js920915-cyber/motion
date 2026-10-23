"""효과음 생성기: public/sfx/*.wav 를 코드로 합성합니다(외부 음원·라이선스 없음).

    python3 scripts/make_sfx.py

소리를 바꾸고 싶으면 아래 함수의 파라미터를 고친 뒤 다시 실행하세요.
"""

import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(7)


def t(sec: float) -> np.ndarray:
    return np.arange(int(SR * sec)) / SR


def env(n: int, attack: float, decay: float) -> np.ndarray:
    """빠른 어택 + 지수 감쇠 엔벨로프."""
    x = np.arange(n) / SR
    a = np.clip(x / max(attack, 1e-4), 0, 1)
    return a * np.exp(-x / decay)


def sweep(f0: float, f1: float, sec: float, curve: float = 1.0) -> np.ndarray:
    """f0 → f1 로 주파수가 변하는 사인파."""
    x = t(sec)
    k = (x / sec) ** curve
    f = f0 + (f1 - f0) * k
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def svf(x: np.ndarray, cutoff: np.ndarray, q: float = 0.7, mode: str = "bp") -> np.ndarray:
    """시간에 따라 컷오프가 변하는 상태변수 필터."""
    low = band = 0.0
    out = np.empty_like(x)
    damp = 1 / q
    for i, s in enumerate(x):
        f = 2 * np.sin(np.pi * min(cutoff[i], SR / 6) / SR)
        high = s - low - damp * band
        band += f * high
        low += f * band
        out[i] = band if mode == "bp" else low if mode == "lp" else high
    return out


def norm(x: np.ndarray, peak_db: float = -3.0) -> np.ndarray:
    return x / (np.abs(x).max() + 1e-9) * 10 ** (peak_db / 20)


def fade(x: np.ndarray, ms: float = 4) -> np.ndarray:
    n = int(SR * ms / 1000)
    x = x.copy()
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def pad(x: np.ndarray, sec: float) -> np.ndarray:
    n = int(SR * sec)
    return np.pad(x, (0, max(0, n - len(x))))[:n]


# ── 소리 정의 ────────────────────────────────────────────────


def type_key(pitch: float) -> np.ndarray:
    """타이핑 1타: 고역 클릭 + 짧은 바디."""
    n = int(SR * 0.06)
    click = np.diff(rng.standard_normal(n + 1)) * env(n, 0.0002, 0.0018)
    body = np.sin(2 * np.pi * pitch * t(0.06)) * env(n, 0.0005, 0.012) * 0.6
    tick = np.sin(2 * np.pi * pitch * 9 * t(0.06)) * env(n, 0.0001, 0.003) * 0.25
    return norm(fade(click * 0.5 + body + tick, 2), -6)


def tick() -> np.ndarray:
    """카운터 틱."""
    n = int(SR * 0.03)
    x = np.sin(2 * np.pi * 3200 * t(0.03)) * env(n, 0.0001, 0.004)
    x += np.diff(rng.standard_normal(n + 1)) * env(n, 0.0001, 0.001) * 0.3
    return norm(fade(x, 1), -8)


def blip(freq: float) -> np.ndarray:
    """UI 블립: 사각파 느낌의 짧은 전자음."""
    n = int(SR * 0.12)
    x = t(0.12)
    s = np.sin(2 * np.pi * freq * x) + 0.3 * np.sin(2 * np.pi * freq * 2 * x) + 0.15 * np.sin(2 * np.pi * freq * 3 * x)
    return norm(fade(s * env(n, 0.002, 0.03)), -6)


def pop() -> np.ndarray:
    """도형·카드가 튀어나올 때의 팝."""
    n = int(SR * 0.14)
    s = sweep(900, 220, 0.14, 0.5) * env(n, 0.001, 0.035)
    s += np.diff(rng.standard_normal(n + 1)) * env(n, 0.0001, 0.0015) * 0.15
    return norm(fade(s), -5)


def whoosh(sec: float = 0.55, f0: float = 250, f1: float = 4200) -> np.ndarray:
    """밴드패스가 위로 쓸려 올라갔다 내려오는 휙 소리."""
    n = int(SR * sec)
    x = np.linspace(0, 1, n)
    cutoff = f0 + (f1 - f0) * np.sin(np.pi * np.clip(x * 1.15, 0, 1)) ** 2
    s = svf(rng.standard_normal(n), cutoff, q=1.4)
    shape = np.sin(np.pi * x) ** 1.6
    return norm(fade(s * shape, 8), -4)


def wipe() -> np.ndarray:
    """픽셀 와이프: 비트크러시 글리치 그레인 + 휙."""
    sec = 0.5
    n = int(SR * sec)
    out = np.zeros(n)
    pos = 0
    while pos < n - 400:
        seg = np.sign(np.sin(2 * np.pi * rng.uniform(300, 2400) * t(rng.uniform(0.012, 0.035)))) * 0.5
        g = len(seg)
        seg += rng.standard_normal(g) * 0.5
        hold = rng.integers(4, 18)
        seg = np.repeat(seg[::hold], hold)[:g]
        seg *= env(len(seg), 0.001, g / SR / 2.5)
        out[pos : pos + len(seg)] += seg[: n - pos] * rng.uniform(0.4, 1.0)
        pos += int(g * rng.uniform(0.6, 1.4))
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 0.8
    w = pad(whoosh(0.5, 400, 5000), sec)
    return norm(fade(out * shape * 0.6 + w * 0.7, 6), -4)


def impact() -> np.ndarray:
    """로고·핵심 문장용 저음 임팩트."""
    sec = 1.2
    n = int(SR * sec)
    sub = sweep(95, 38, sec, 0.35) * env(n, 0.002, 0.32)
    knock = svf(rng.standard_normal(n), np.full(n, 900.0), q=0.8, mode="lp") * env(n, 0.0005, 0.03)
    x = np.tanh((sub * 1.4 + knock * 0.8) * 1.6)
    return norm(fade(x, 10), -2)


def thump() -> np.ndarray:
    """비트마다 키워드가 바뀔 때의 짧은 킥."""
    sec = 0.35
    n = int(SR * sec)
    x = sweep(160, 50, sec, 0.3) * env(n, 0.001, 0.08)
    x += np.diff(rng.standard_normal(n + 1)) * env(n, 0.0001, 0.002) * 0.25
    return norm(fade(np.tanh(x * 1.5)), -4)


def alert() -> np.ndarray:
    """통증 감지: 낮은 킥 + 두 번 울리는 스캔 비프."""
    sec = 0.4
    n = int(SR * sec)
    x = pad(thump(), sec) * 0.8
    for start in (0.0, 0.09):
        b = blip(1480) * 0.45
        i = int(SR * start)
        x[i : i + len(b)] += b[: n - i]
    return norm(fade(x), -4)


def riser() -> np.ndarray:
    """로고 리빌 직전에 차오르는 소리."""
    sec = 0.75
    n = int(SR * sec)
    x = np.linspace(0, 1, n)
    noise = svf(rng.standard_normal(n), 400 + 6000 * x**2, q=2.0)
    tone = sweep(180, 900, sec, 2.0) * 0.35
    s = (noise + tone) * x**2.2
    return norm(fade(s, 3), -5)


def shutter() -> np.ndarray:
    """사진·영상 패널이 열릴 때의 셔터: 짧은 기계음 두 번."""
    sec = 0.16
    n = int(SR * sec)
    x = np.zeros(n)
    for start, amp in ((0.0, 1.0), (0.045, 0.7)):
        m = int(SR * 0.03)
        burst = svf(rng.standard_normal(m), np.full(m, 3200.0), q=1.2) * env(m, 0.0003, 0.006)
        burst += np.sin(2 * np.pi * 900 * t(0.03)) * env(m, 0.0003, 0.004) * 0.4
        i = int(SR * start)
        x[i : i + m] += burst * amp
    return norm(fade(x, 2), -5)


def ding() -> np.ndarray:
    """결과·CTA용 맑은 벨."""
    sec = 1.4
    n = int(SR * sec)
    f0 = 1318.5
    x = np.zeros(n)
    for ratio, amp, dec in ((1, 1.0, 0.55), (2.0, 0.35, 0.3), (2.76, 0.4, 0.22), (5.4, 0.18, 0.1), (8.93, 0.08, 0.05)):
        x += amp * np.sin(2 * np.pi * f0 * ratio * t(sec)) * env(n, 0.001, dec)
    return norm(fade(x, 10), -6)


SOUNDS = {
    "type-1": lambda: type_key(210),
    "type-2": lambda: type_key(240),
    "type-3": lambda: type_key(190),
    "tick": tick,
    "blip": lambda: blip(1320),
    "blip-low": lambda: blip(880),
    "pop": pop,
    "whoosh": whoosh,
    "wipe": wipe,
    "impact": impact,
    "thump": thump,
    "alert": alert,
    "riser": riser,
    "shutter": shutter,
    "ding": ding,
}


def write(name: str, x: np.ndarray) -> None:
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, make in SOUNDS.items():
        x = make()
        write(name, x)
        print(f"{name:10s} {len(x) / SR:5.2f}s")
