import { Router, type IRouter } from "express";
import { db, waitlistTable } from "@workspace/db";
import { JoinWaitlistBody } from "@workspace/api-zod";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.post("/waitlist", async (req, res) => {
  const parsed = JoinWaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Invalid request. Please provide a valid email." });
    return;
  }

  const { email, name } = parsed.data;

  try {
    const existing = await db
      .select()
      .from(waitlistTable)
      .where(eq(waitlistTable.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "This email is already on the waitlist." });
      return;
    }

    await db.insert(waitlistTable).values({
      email: email.toLowerCase(),
      name: name ?? null,
    });

    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(waitlistTable);

    res.status(201).json({
      success: true,
      message: "You're on the waitlist! We'll reach out when your family system is ready.",
      position: Number(totalCount),
    });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.get("/waitlist", async (_req, res) => {
  try {
    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(waitlistTable);

    res.json({ count: Number(totalCount) });
  } catch (err) {
    console.error("Waitlist count error:", err);
    res.json({ count: 0 });
  }
});

export default router;
