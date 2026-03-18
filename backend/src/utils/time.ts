export function addDuration(from: Date, duration: string): Date {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    const seconds = Number(duration);
    if (Number.isFinite(seconds)) {
      return new Date(from.getTime() + seconds * 1000);
    }
    throw new Error(`Unsupported duration format: ${duration}`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(from.getTime() + value * multipliers[unit]);
}
