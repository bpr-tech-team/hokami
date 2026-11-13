# Správa volných pozic HOKAMI

Otevřete `/keystatic` na webu HOKAMI a přihlaste se přes Keystatic Cloud.
V levém menu vyberte **Volné pozice**. Běžná práce probíhá v hlavní větvi `main`;
nové větve ani pull requesty vytvářet nemusíte.

Jazyk rozhraní přepnete tlačítkem s ikonou jazyků vpravo v horní liště, vedle
tlačítka **Uložit**. Nabídka obsahuje češtinu, angličtinu, němčinu, finštinu a
polštinu. Volba se v prohlížeči pamatuje a nemění jazyk textů pozice. Před
přepnutím uložte nebo zahoďte rozpracované změny; stránka se při přepnutí znovu načte.

## Přidání a úpravy

Vyberte **Přidat**, nebo otevřete existující pozici. Vyplňte anglický název,
oddělení, krátký text a hlavní popis. Všechna čtyři anglická pole jsou povinná,
i u skryté pozice. Identifikátor se vytvoří automaticky; u existující pozice
ho neměňte. Hlavní popis upravujte jako v textovém editoru: můžete používat nadpisy,
seznamy, tučné písmo, odkazy, tabulky a obrázky. Hlavní popis se zobrazí na stránce
`/[jazyk]/jobs/[identifikátor]`. Prázdný anglický text, samotné mezery nebo prázdné
nadpisy nelze uložit. Původní tři pozice začínají existujícím anglickým krátkým
popisem; můžete ho rozšířit o schválený podrobný obsah.

## Sekce a sloupce

V hlavním popisu otevřete nabídku **+** a vyberte **Jeden sloupec** nebo **Dva sloupce**. Nová sekce se vloží
na pozici kurzoru. Pokud je kurzor uvnitř sloupce, nová sekce se přidá za jeho
celou sekci. Náplň práce s fotografií nebo požadavky s nabídkou sestavte
z běžných bloků: do jednoho sloupce vložte text a do druhého obrázek nebo další text.
Jeden a dva sloupce jsou první; ostatní položky jsou seřazené podle abecedy.
Označený blok nebrání vložení dalšího stejného bloku: nová sekce, seznam,
citace, obrázek nebo vložený obsah se přidá za něj.

Každý sloupec upravujte přímo v editoru. Můžete kombinovat nadpisy, odstavce,
odrážkové a číslované seznamy, obrázky, tabulky, citace a oddělovací linky.
Citaci vložte přes **+ → Citace**, oddělovací linku přes **+ → Oddělovací čára**.
Po vložení citace můžete rovnou psát do jejího prvního odstavce.
Přes nabídku vložení jsou dostupné také **Seznam s fajfkami** a
**Obrázek**. Seznam s fajfkami rovnou vytvoří první bod:
pište přímo do něj, klávesou Enter přidáte další bod.
U fotografie použijte tlačítko úpravy bloku k výběru souboru a vyplnění
alternativního textu; nevyplněnou fotografii nelze uložit.

Lišta sekce přepíná počet sloupců a bílé nebo jemné pozadí. Při změně ze dvou
sloupců na jeden se obsah spojí: nejprve levý, potom pravý. Při opětovném
rozdělení zůstane spojený obsah vlevo a pravý sloupec je prázdný. Šipky
přesouvají celou sekci nahoru a dolů; koš ji odstraní. Jednotlivé části obsahu
lze označit, vyjmout a vložit na jiné místo nebo do druhého sloupce.

Sekce zůstávají na nejvyšší úrovni dokumentu; nevnořují se do jiných sekcí.
V každé jazykové verzi můžete použít jinou strukturu. Starší texty lze nadále
upravovat bez převodu na sekce. V úzkém editoru a na menších obrazovkách se
sloupce zobrazují pod sebou. Rozměry, barvy a písmo určuje společný design webu.

Sekce neobsahují schválené pracovní podmínky ani požadavky. Doplňte skutečné
údaje konkrétní pozice a text před zveřejněním zkontrolujte.

Obrázek vložíte přes **+ → Obrázek**, tabulku přes **+ → Tabulka**.
Povolené formáty obrázků jsou **PNG,
JPG/JPEG a WEBP**, nejvýše **0,5 MB na každý soubor**. Větší obrázek nejprve
zmenšete nebo komprimujte. Nepodporovaný či příliš velký soubor se nevloží a
editor zobrazí chybu. U obrázků doplňujte výstižný alternativní text.

Video, mapu nebo jiný iframe vložte přes **+ → Vložený obsah**. Tlačítkem
**Upravit** otevřete blok, vložte HTTPS adresu určenou pro vložení nebo celý kód
iframe a doplňte název obsahu. U videa použijte adresu pro vložení, například
YouTube `/embed/…`. Editor zobrazuje název a zdroj; samotný obsah se zobrazí na
webu. Tlačítka Code a Code block slouží k formátování textu kódu, proto jsou
z panelu odstraněná.

Český, německý, finský a polský překlad jsou nepovinné. Karta použije překlad,
až v daném jazyce vyplníte název, oddělení a krátký text. Do té doby se celá
karta zobrazuje anglicky. Práci na neúplném překladu můžete uložit. Chybějící
překlad hlavního popisu se samostatně nahradí anglickým popisem; přeložený název
a úvod zůstávají ve zvoleném jazyce.

Tlačítkem **Kopírovat obsah** uvnitř editoru vedle **+** zkopírujete celý jeho obsah
včetně sekcí, formátování, tabulek a obrázků. V pravé nabídce přejděte na cílový
jazyk, klikněte do jeho editoru a vložte obsah pomocí **Ctrl+V** nebo **⌘V**.
Chcete-li nahradit existující popis, nejprve označte jeho obsah. Kopírování
zdrojový popis nemění; vložený text pak přeložte. Prohlížeč může požádat
o povolení přístupu ke schránce.

Popisek odkazu **Číst dále** se překládá automaticky podle jazyka stránky,
i když se text pozice zobrazí anglicky. Samostatné pole pro tento popisek není.

V pravém panelu **Zobrazit v jazykových verzích** zaškrtněte, na kterých verzích
webu má pozice být vidět. Panel při posouvání stránky zůstává po ruce a nabízí
odkazy na jednotlivé popisy. Na menších obrazovkách je nad anglickými poli.
Přechody na popisy používají plynulé posouvání; při omezení animací v systému
se stránka přesune okamžitě.
Vypnutý překlad se ve formuláři skryje, jeho obsah zůstane uložený. Po opětovném
zaškrtnutí se znovu zobrazí. Anglický originál zůstává vždy dostupný.
Zpočátku jsou vybrány všechny jazyky; bez výběru se pozice
nezobrazí nikde. Tento výběr je nezávislý na překladech: vyplněný překlad sám
pozici nezveřejní, chybějící překlad se nahradí angličtinou. Anglická pole jsou
povinná i tehdy, když anglickou verzi webu nevyberete.

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
