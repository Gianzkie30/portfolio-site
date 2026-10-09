import { requireUser } from "@/lib/auth";
import { db, Skill } from "@/lib/db";
import { addSkill, deleteSkill, updateSkill } from "@/lib/actions";
import { SKILL_LEVELS } from "@/lib/constants";
import { Alert } from "@/components/ui";

function LevelSelect({ value }: { value?: string }) {
  return (
    <select name="level" defaultValue={value ?? "Intermediate"} className="input sm:w-40">
      {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
    </select>
  );
}

export default async function SkillsPage({ searchParams }: { searchParams: { error?: string; saved?: string } }) {
  const user = await requireUser();
  const sql = await db();
  const skills = (await sql`SELECT * FROM skills WHERE user_id = ${user.id} ORDER BY name`) as Skill[];

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-4xl font-bold">Skills</h1>
      <Alert error={searchParams.error} saved={searchParams.saved} msg="Skills updated." />

      <form action={addSkill} className="card mb-6 flex flex-col gap-3 sm:flex-row">
        <input name="name" required placeholder="Add a skill, e.g. UI Design" className="input" />
        <LevelSelect />
        <button className="btn btn-accent whitespace-nowrap">Add skill</button>
      </form>

      <div className="space-y-3">
        {skills.length === 0 && <p className="text-sm text-ink/60">You haven&apos;t added any skills yet.</p>}
        {skills.map((s) => (
          <div key={s.id} className="card flex flex-col gap-3 !p-4 sm:flex-row sm:items-center">
            <form action={updateSkill} className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input type="hidden" name="id" value={s.id} />
              <input name="name" defaultValue={s.name} required className="input" />
              <LevelSelect value={s.level} />
              <button className="btn btn-ghost">Save</button>
            </form>
            <form action={deleteSkill}>
              <input type="hidden" name="id" value={s.id} />
              <button className="btn btn-danger">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
