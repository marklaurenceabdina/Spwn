/**
 * Secure password hashing utilities using Web Crypto API
 * Uses PBKDF2 with SHA-256 for key derivation
 */

/**
 * Generate a random salt for password hashing
 */
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash a password using PBKDF2
 * Returns: salt$hash (salt and hash separated by $)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, ["deriveBits"]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return `${salt}$${hashHex}`;
}

/**
 * Verify a password against a stored hash
 * Stored hash format: salt$hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split("$");
  if (!salt || !hash) return false;

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, ["deriveBits"]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const computedHash = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return computedHash === hash;
}
