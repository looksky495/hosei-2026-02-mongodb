/**
 * @param {import("mongodb").Db} db
 * @param {string} name
  * @returns {Promise<{ status: number, message: string }>}
 */
export async function insertUser(db, name) {
  if (!name || typeof name !== "string" || name.length >= 100) {
    return { status: 400, message: "Bad Request" };
  }
  await db.collection("user").insertOne({ name });
  return { status: 200, message: "OK" };
}
