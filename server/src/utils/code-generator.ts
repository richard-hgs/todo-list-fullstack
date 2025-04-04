
// TODO Pending documentation
// noinspection SpellCheckingInspection

export function generateOTP(n: number) {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < n; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

export function generateUUID(): string {
  const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return chars.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}