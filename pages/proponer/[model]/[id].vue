<template>
  <AccountPanel :title="creating ? 'Proponer un cerro nuevo' : 'Proponer una corrección'" wide>
    <p v-if="loading" class="notice">Cargando…</p>
    <p v-else-if="loadError" class="notice warn">{{ loadError }}</p>

    <template v-else-if="!me?.email_verified">
      <p class="notice warn">
        Para proponer cambios, primero confirma tu correo. Te enviamos un enlace al crear la cuenta.
      </p>
      <button class="secondary" type="button" :disabled="resent" @click="resend">
        {{ resent ? "Correo enviado" : "Reenviar correo de confirmación" }}
      </button>
    </template>

    <template v-else-if="sent">
      <p class="notice" role="status">
        ¡Gracias! Tu propuesta quedó enviada. Un editor la revisará y te avisaremos por correo.
      </p>
      <div class="links">
        <NuxtLink v-if="recordPath" :to="recordPath">Volver a la ficha</NuxtLink>
        <NuxtLink to="/mi-cuenta#aportes">Ver mis aportes</NuxtLink>
      </div>
    </template>

    <template v-else>
      <p class="record">
        <NuxtLink v-if="recordPath" :to="recordPath" class="inline">{{ title }}</NuxtLink>
      </p>
      <p v-if="editing?.editor_message" class="notice warn">
        <strong>Mensaje del editor:</strong> {{ editing.editor_message }}
      </p>
      <p class="hint intro-text">
        <template v-if="creating">
          Completa lo que sepas del cerro (al menos el prefijo y el nombre).
        </template>
        <template v-else>Cambia solo los datos que quieras corregir o completar.</template>
        Un editor revisará la propuesta antes de publicarla y, si se aprueba, aparecerás en
        «Con aportes de» al pie de la ficha.
      </p>

      <form @submit.prevent="submit" novalidate>
        <template v-for="f in fields" :key="f.name">
          <!-- Yes / no -->
          <label v-if="f.type === 'boolean'" class="check" :class="{ changed: isChanged(f) }">
            <input v-model="values[f.name]" type="checkbox" />
            <span>{{ f.label }}</span>
          </label>

          <!-- Date known to the day, month or year -->
          <fieldset v-else-if="f.type === 'partial_date'" class="date" :class="{ changed: isChanged(f) }">
            <legend>{{ f.label }}</legend>
            <div class="date-row">
              <label>
                <span class="hint">Se sabe</span>
                <select v-model="values[f.name].format">
                  <option :value="2">Día, mes y año</option>
                  <option :value="1">Mes y año</option>
                  <option :value="0">Solo el año</option>
                </select>
              </label>
              <label v-if="values[f.name].format === 2" class="small">
                <span class="hint">Día</span>
                <input v-model="values[f.name].day" type="number" min="1" max="31" inputmode="numeric" />
              </label>
              <label v-if="values[f.name].format >= 1" class="small">
                <span class="hint">Mes</span>
                <input v-model="values[f.name].month" type="number" min="1" max="12" inputmode="numeric" />
              </label>
              <label class="year">
                <span class="hint">Año</span>
                <input v-model="values[f.name].year" type="number" min="1800" max="2100" inputmode="numeric" />
              </label>
            </div>
            <p v-for="m in [...(errors[f.name] || []), ...(errors.date_format || [])]" :key="m" class="error">{{ m }}</p>
          </fieldset>

          <div v-else-if="f.type === 'multi' || f.type === 'people'" class="group" :class="{ changed: isChanged(f) }">
            <span class="group-label">{{ f.label }}</span>
            <ProposalPeople v-if="f.type === 'people'" v-model="values[f.name]" :label="f.label" />
            <ProposalChecklist v-else v-model="values[f.name]" :options="f.options || []" :label="f.label" />
            <p v-for="m in errors[f.name] || []" :key="m" class="error">{{ m }}</p>
          </div>

          <label v-else :class="{ changed: isChanged(f) }">
            <span>{{ f.label }}<span v-if="creating && f.required" class="req"> *</span></span>
            <span v-if="f.help" class="hint">{{ f.help }}</span>
            <select v-if="f.type === 'choice'" v-model="values[f.name]">
              <option v-if="f.empty || values[f.name] === null" :value="null">—</option>
              <option v-for="o in f.options" :key="String(o.value)" :value="o.value">{{ o.label }}</option>
            </select>
            <textarea v-else-if="f.type === 'textarea'" v-model="values[f.name]" maxlength="5000" rows="5" />
            <input
              v-else-if="f.type === 'integer'"
              v-model="values[f.name]"
              type="number"
              step="1"
              inputmode="numeric"
            />
            <input
              v-else
              v-model="values[f.name]"
              type="text"
              :inputmode="f.type === 'decimal' ? 'decimal' : undefined"
              :maxlength="f.max_length || undefined"
            />
            <p v-for="m in errors[f.name] || []" :key="m" class="error">{{ m }}</p>
          </label>
        </template>

        <h2>¿De dónde sale esta información?</h2>
        <label>
          <span>Fuente<span class="req"> *</span></span>
          <span class="hint">
            Libro, revista, carta topográfica, enlace, o tu propia experiencia (por ejemplo, «subí en 2019,
            medición con GPS»).
          </span>
          <textarea v-model="source" maxlength="1000" rows="3" />
          <p v-for="m in errors.source || []" :key="m" class="error">{{ m }}</p>
        </label>
        <label>
          <span>Comentario para el editor (opcional)</span>
          <textarea v-model="comment" maxlength="2000" rows="3" />
        </label>

        <p v-for="m in errors[''] || []" :key="m" class="error">{{ m }}</p>
        <p v-if="otherErrors.length" class="error">{{ otherErrors.join(" ") }}</p>
        <div class="actions">
          <button class="primary" type="submit" :disabled="sending">
            {{ editing ? "Reenviar propuesta" : "Enviar propuesta" }}
          </button>
          <span class="hint">{{ changedCount }} {{ changedCount === 1 ? "dato cambiado" : "datos cambiados" }}</span>
        </div>
      </form>
    </template>
  </AccountPanel>
</template>

<script setup lang="ts">
// Propose a change to a record (or a new mountain). The form comes from the
// API (which fields, their type and current value); only the fields that
// change are sent. Reviewed by an editor in the admin before it's applied.
useHead({ title: "Proponer un cambio", meta: [{ name: "robots", content: "noindex" }] });

type Option = { value: any; label: string };
type Field = {
  name: string;
  label: string;
  help: string;
  type: "text" | "textarea" | "integer" | "decimal" | "boolean" | "choice" | "multi" | "people" | "partial_date";
  value: any;
  options?: Option[];
  required: boolean;
  empty: boolean;
  max_length?: number;
};
type DateValue = { format: number; year: string; month: string; day: string };

const PATHS: Record<string, string> = { cerro: "/cerros", ruta: "/rutas", ascenso: "/ascensos", andinista: "/andinistas" };

const route = useRoute();
const auth = useAuth();
const me = auth.me;
const model = String(route.params.model);
const target = String(route.params.id);
const creating = target === "nuevo";
const editingId = route.query.propuesta ? Number(route.query.propuesta) : null;

const loading = ref(true);
const loadError = ref("");
const title = ref("");
const fields = ref<Field[]>([]);
const values = reactive<Record<string, any>>({});
const original: Record<string, string> = {}; // serialized, to compare
const editing = ref<any>(null);
const source = ref("");
const comment = ref("");
const errors = ref<FormErrors>({});
const sending = ref(false);
const sent = ref(false);
const resent = ref(false);

const recordPath = computed(() => (!creating && PATHS[model] ? `${PATHS[model]}/${target}` : ""));

// --- Values: from the API to the inputs and back ------------------------------

function toInput(f: Field, value: any): any {
  if (f.type === "partial_date") {
    const [year = "", month = "", day = ""] = (value?.date || "").split("-");
    return { format: value?.format ?? 2, year, month: month.replace(/^0/, ""), day: day.replace(/^0/, "") };
  }
  if (f.type === "multi") return [...(value || [])];
  if (f.type === "people") return [...(value || [])];
  if (f.type === "boolean") return !!value;
  if (f.type === "choice") return value ?? null;
  return value === null || value === undefined ? "" : String(value);
}

const pad = (s: string) => String(s || "1").padStart(2, "0");

/** {field: value} as the API expects it (a date gives date and date_format). */
function toApi(f: Field, value: any): Record<string, any> {
  switch (f.type) {
    case "partial_date": {
      const d = value as DateValue;
      if (!String(d.year).trim()) return { [f.name]: null, date_format: d.format };
      const month = d.format >= 1 ? pad(d.month) : "01";
      const day = d.format === 2 ? pad(d.day) : "01";
      return { [f.name]: `${String(d.year).trim()}-${month}-${day}`, date_format: d.format };
    }
    case "multi":
      return { [f.name]: [...value].sort((a, b) => a - b) };
    case "people":
      return { [f.name]: value.map((p: any) => p.id).sort((a: number, b: number) => a - b) };
    case "integer":
      return { [f.name]: String(value).trim() === "" ? null : Number(value) };
    case "decimal":
      return { [f.name]: String(value).trim() === "" ? null : String(value).trim().replace(",", ".") };
    case "boolean":
    case "choice":
      return { [f.name]: value };
    default:
      return { [f.name]: String(value ?? "").trim() };
  }
}

const key = (f: Field, value: any) => JSON.stringify(toApi(f, value));
const isChanged = (f: Field) => key(f, values[f.name]) !== original[f.name];
const changedCount = computed(() => fields.value.filter(isChanged).length);

function changes() {
  const result: Record<string, any> = {};
  for (const f of fields.value) if (isChanged(f)) Object.assign(result, toApi(f, values[f.name]));
  return result;
}

// Errors for fields that aren't shown (should not happen, but never hide one).
const otherErrors = computed(() => {
  const shown = new Set([...fields.value.map((f) => f.name), "", "source", "date_format"]);
  return Object.entries(errors.value)
    .filter(([k]) => !shown.has(k))
    .flatMap(([, v]) => v);
});

// --- Loading -------------------------------------------------------------------

onMounted(async () => {
  const user = await auth.ensureChecked();
  if (!user) {
    return navigateTo({ path: "/entrar", query: { next: route.fullPath } }, { replace: true });
  }
  const form = await auth.request("GET", `/djangoapi/proposals/form/${model}/${target}/`);
  if (!form.ok) {
    loadError.value = form.status === 404 ? "Esta ficha no existe." : "No se pudo cargar el formulario.";
    loading.value = false;
    return;
  }
  title.value = form.data.title;
  // A list with nothing to choose from (e.g. no sectors yet) is not shown.
  fields.value = (form.data.fields as Field[]).filter((f) => f.type !== "multi" || f.options?.length);
  for (const f of fields.value) {
    values[f.name] = toInput(f, f.value);
    original[f.name] = key(f, values[f.name]);
  }
  if (editingId) {
    // Editing a proposal that is still open: its values over the current ones.
    const r = await auth.request("GET", `/djangoapi/me/proposals/${editingId}/`);
    if (r.ok && [0, 1].includes(r.data.status)) {
      editing.value = r.data;
      source.value = r.data.source;
      comment.value = r.data.comment;
      for (const f of fields.value) {
        if (f.type === "partial_date") {
          if (f.name in r.data.values || "date_format" in r.data.values) {
            values[f.name] = toInput(f, {
              date: r.data.values[f.name] ?? f.value?.date,
              format: r.data.values.date_format ?? f.value?.format,
            });
          }
        } else if (f.name in r.data.values) {
          values[f.name] = toInput(f, r.data.values[f.name]);
        }
      }
    }
  }
  loading.value = false;
});

async function resend() {
  const r = await auth.resendVerification(me.value!.email);
  resent.value = r.ok;
}

// --- Sending -------------------------------------------------------------------

async function submit() {
  errors.value = {};
  const data = changes();
  if (!Object.keys(data).length) {
    errors.value = { "": ["No cambiaste ningún dato."] };
    return;
  }
  if (!source.value.trim()) {
    errors.value = { source: ["Indica la fuente de esta información."] };
    return;
  }
  sending.value = true;
  const body = { changes: data, source: source.value, comment: comment.value };
  const r = editing.value
    ? await auth.request("PATCH", `/djangoapi/me/proposals/${editing.value.id}/`, body)
    : await auth.request("POST", "/djangoapi/proposals/", {
        ...body,
        model,
        target_id: creating ? null : Number(target),
      });
  sending.value = false;
  if (r.ok) {
    sent.value = true;
    window.scrollTo({ top: 0 });
  } else {
    errors.value = r.errors;
    nextTick(() => document.querySelector(".error")?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }
}
</script>

<style scoped lang="scss">
.record {
  text-align: center;
  margin: -4px 0 18px;
  font-size: 1.1rem;
}
.intro-text {
  display: block;
  margin: 0 0 24px;
}
.req {
  color: $color-main-second;
}
.group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.group-label,
legend {
  font-weight: 600;
  font-size: 0.95rem;
}
fieldset.date {
  border: 0;
  padding: 0;
  margin: 0;
  legend {
    padding: 0;
    margin-bottom: 6px;
  }
}
.date-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  label {
    flex: 1 1 150px;
  }
  label.small {
    flex: 0 1 80px;
  }
  label.year {
    flex: 0 1 110px;
  }
}
// A changed field gets a mark on the left, so the person sees what they're sending.
.changed {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: -12px;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 2px;
    background: $color-main-first;
  }
}
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
