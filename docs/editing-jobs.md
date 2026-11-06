# Správa volných pozic HOKAMI

Otevřete `/keystatic` na webu HOKAMI a přihlaste se přes Keystatic Cloud.
V levém menu vyberte **Volné pozice**. Běžná práce probíhá v hlavní větvi `main`;
nové větve ani pull requesty vytvářet nemusíte.

## Přidání a úpravy

Vyberte **Přidat**, nebo otevřete existující pozici. Vyplňte anglický název,
oddělení, krátký text a hlavní text. Všechna čtyři anglická pole jsou povinná,
i u skryté pozice. Identifikátor se vytvoří automaticky; u existující pozice
ho neměňte. Hlavní text upravujte jako v textovém editoru: můžete používat nadpisy,
seznamy, tučné písmo, odkazy, tabulky a obrázky. Hlavní text se zobrazí na stránce
`/[jazyk]/jobs/[identifikátor]`. Prázdný anglický text, samotné mezery nebo prázdné
nadpisy nelze uložit. Původní tři pozice začínají existujícím anglickým krátkým
popisem; můžete ho rozšířit o schválený podrobný obsah.

Obrázek vložíte tlačítkem **Image** v editoru. Povolené formáty jsou **PNG,
JPG/JPEG a WEBP**, nejvýše **0,5 MB na každý soubor**. Větší obrázek nejprve
zmenšete nebo komprimujte. Nepodporovaný či příliš velký soubor se nevloží a
editor zobrazí chybu. U obrázků doplňujte výstižný alternativní text.

Český, německý, finský a polský překlad jsou nepovinné. Karta použije překlad,
až v daném jazyce vyplníte název, oddělení a krátký text. Do té doby se celá
karta zobrazuje anglicky. Práci na neúplném překladu můžete uložit. Chybějící
překlad hlavního textu se samostatně nahradí anglickým textem; přeložený název
a úvod zůstávají ve zvoleném jazyce.

Popisek odkazu **Číst dále** se překládá automaticky podle jazyka stránky,
i když se text pozice zobrazí anglicky. Starší pole **Text odkazu** už popisek
na webu nemění.

V poli **Zobrazit v jazykových verzích** zaškrtněte, na kterých verzích webu má
pozice být vidět. Zpočátku jsou vybrány všechny jazyky; bez výběru se pozice
nezobrazí nikde. Tento výběr je nezávislý na překladech: vyplněný překlad sám
pozici nezveřejní, chybějící překlad se nahradí angličtinou. Anglická pole jsou
povinná i tehdy, když anglickou verzi webu nevyberete.

**Pořadí** určuje umístění na webu: nižší číslo je dříve. Nová pozice má stav
**Skrytá**. Pro zveřejnění vyberte **Zveřejněná** a uložte. Změny zveřejněné
pozice se po uložení také publikují.

## Skrytí a odstranění

Chcete-li pozici dočasně stáhnout, změňte stav na **Skrytá** a uložte ji. Texty
zůstanou připravené pro další použití. Trvalé odstranění začíná tlačítkem
**Delete entry…** a vyžaduje potvrzení. Obnovení odstraněné pozice řeší správce
webu ze zálohy v historii projektu.

## Kontrola zveřejnění

Uložení spustí aktualizaci webu. Počkejte na dokončení a zkontrolujte seznam
na `/cs/jobs` a přes kartu otevřete také stránku pozice, případně další jazyk.
Formulář přihlášky zatím pouze kontroluje vyplněné údaje a soubory; přihlášku
neodesílá a nabízí kontakt `prace@hokami.cz`. Pokud se objeví chyba ukládání nebo se web
neaktualizuje, obraťte se na správce. Při chybě publikace zůstává dostupná
předchozí funkční verze webu.
