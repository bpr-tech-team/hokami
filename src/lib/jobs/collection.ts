import { collection, config, fields } from "@keystatic/core";
import { languages } from "@/i18n/languages";
import { jobContentField } from "./content-field";

const requiredText = {
  isRequired: true,
  pattern: { regex: /\S/, message: "Vyplňte prosím text, nejen mezery." },
};

function translationFields(label: string) {
  return fields.object(
    {
      title: fields.text({
        label: "Název pozice",
        validation: { length: { max: 200 } },
      }),
      department: fields.text({
        label: "Oddělení",
        validation: { length: { max: 120 } },
      }),
      description: fields.text({
        label: "Krátký text",
        multiline: true,
        validation: { length: { max: 2000 } },
      }),
      linkLabel: fields.text({
        label: "Text odkazu (nepovinný)",
        validation: { length: { max: 200 } },
      }),
      content: jobContentField(),
    },
    {
      label,
      description:
        "Karta použije překlad, až vyplníte název, oddělení a krátký text. Jinak se celá zobrazí anglicky. Vyplnění překladu nemění výběr jazykových verzí. Hlavní text je zatím nepovinný.",
    },
  );
}

export const jobsCollection = collection({
  label: "Volné pozice",
  path: "src/content/jobs/*/",
  slugField: "title",
  format: { data: "json" },
  columns: ["title", "status", "order"],
  schema: {
    title: fields.slug({
      name: {
        label: "Název pozice (anglicky)",
        validation: { ...requiredText, length: { max: 200 } },
      },
      slug: {
        label: "Identifikátor",
        description: "Po vytvoření neměňte.",
        validation: {
          pattern: {
            regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            message: "Použijte malá písmena bez diakritiky, číslice a pomlčky.",
          },
        },
      },
    }),
    department: fields.text({
      label: "Oddělení (anglicky)",
      validation: { ...requiredText, length: { max: 120 } },
    }),
    description: fields.text({
      label: "Krátký text (anglicky)",
      multiline: true,
      validation: { ...requiredText, length: { max: 2000 } },
    }),
    linkLabel: fields.text({
      label: "Text odkazu (nepovinný)",
      description: "Prázdný text se doplní podle názvu pozice.",
      validation: { length: { max: 200 } },
    }),
    content: jobContentField(),
    status: fields.select({
      label: "Stav",
      options: [
        { label: "Skrytá", value: "draft" },
        { label: "Zveřejněná", value: "published" },
      ],
      defaultValue: "draft",
    }),
    visibleLocales: fields.multiselect({
      label: "Zobrazit v jazykových verzích",
      description:
        "Vyberte, kde se má zveřejněná pozice zobrazit. Bez výběru se nezobrazí nikde. Chybějící překlad se nahradí angličtinou.",
      options: languages.map(({ locale, name }) => ({
        label: name,
        value: locale,
      })),
      defaultValue: languages.map(({ locale }) => locale),
    }),
    order: fields.integer({
      label: "Pořadí",
      description: "Nižší číslo se zobrazí dříve.",
      defaultValue: 100,
      validation: { isRequired: true, min: 0 },
    }),
    translations: fields.object(
      {
        cs: translationFields("Čeština"),
        de: translationFields("Deutsch"),
        fi: translationFields("Suomi"),
        pl: translationFields("Polski"),
      },
      { label: "Překlady" },
    ),
  },
});

// Reading the checkout never needs Cloud credentials or write access.
export const jobsReaderConfig = config({
  storage: { kind: "local" },
  collections: { jobs: jobsCollection },
});
