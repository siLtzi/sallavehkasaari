# Salla Vehkasaari — sivustoluonnos

Next.js App Router + React + TypeScript. Uusi suunnittelusuunta: fyysinen valokuva-albumi, vaalea paperi ja puuteriset sävyt, käsinkirjoitettu nimi, vedosten reunat ja varjot. Tekstit mukailevat alkuperäisen sivuston arkista puhetapaa.

## Käynnistys

```sh
npm install
npm run dev
```

Avaa terminaalin ilmoittama paikallinen osoite. Tuotantokoonti: `npm run build`. Tyypit: `npm run typecheck`.

## Toteutus

- `app/page.tsx`: vieritykseen reagoiva kuvapino, sivuttain selattava albumi ja kuvakatselin, pakettivalitsin, mobiilivalikko, postikorttilomake.
- `app/globals.css`: responsiivinen ulkoasu, liike ja reduced-motion-tuki.
- `app/layout.tsx`: suomenkielisyys, metatiedot ja fontit. Luonnoksessa hakukoneindeksointi on estetty.
- Kuvakatselin toimii myös nuolinäppäimillä ja sulkeutuu Esc-näppäimellä. Natiivi dialog huolehtii fokuksen rajauksesta.
- Logot käyttävät `public/sv.png`-kuvaa, joka sävytetään CSS:llä vaaleaan ulkoasuun sopivaksi.
- Mobiilivalikko avautuu pehmeästi ja linkit ilmestyvät porrastetusti. Näppäimistöfokus pysyy valikossa, Esc sulkee sen ja reduced-motion-asetus poistaa animaatiot.
- Hinnastolaput laskeutuvat näkyviin hennolla kierrolla ja tiivistyvällä varjolla. Työpöydällä saapuminen porrastetaan 150 ms välein, mobiilissa kukin lappu paljastuu vieritettäessä. Pakettityypin vaihto häivyttää vanhat laput ennen uusia; reduced-motion näyttää sisällön ilman liikettä tai häivytystä.

## Sisältö ja jatkokehitys

Valokuvat ovat Sallan nykyisen sivuston julkisia Pixieset-kuvia, joita ladataan suoraan alkuperäisestä osoitteesta. Lähde: https://www.sallavehkasaari.fi/ . Google Fonts toimittaa Jost- ja Nothing You Could Do -kirjasimet; niiden puuttuessa käytetään järjestelmäfontteja. Tuotantoon kuvat kannattaa siirtää luvallisesti omaan mediahakemistoon tai Sanityyn ja optimoida Next Imagella, fontit paikallisiksi.

Animaatiot: avauksen kuvat laskeutuvat pinoksi ja erkanevat vierityksen mukana, vedokset kallistuvat hiiren mukana, esittelyn kuvat kiertyvät vierityksessä ja paperiosiot saapuvat näkyviin. Liike käyttää transform-ominaisuuksia ja requestAnimationFrame-päivityksiä; reduced-motion poistaa liikkeen ja pitkän kiinnitetyn avauksen. Albumi toimii kosketuksella, näppäimistöllä ja nuolipainikkeilla.

Tekstit ovat alustavaa uudelleenkirjoitusta toimitetuista referensseistä. Paketit pohjautuvat nykyisen sivuston hinnastoon, mutta valikoima on rajattu suunnitteluluonnosta varten. Vahvista tekstit, hinnat ja lopullinen palveluvalikoima Sallan kanssa.

Lomake validoi kentät ja näyttää paikallisen demokuittauksen. Se **ei lähetä eikä tallenna** tietoja. Lähetys, tietosuojaseloste ja mahdollinen CMS liitetään myöhemmin. Ei tekaistuja asiakasarvioita.

Tässä ympäristössä npm-rekisterin verkkoyhteys oli estetty, joten esikatselua varten tarvittavat riippuvuudet kopioitiin koneella jo olleesta Next.js-asennuksesta projektin omaan node_modules-kansioon. Muut projektit eivät muutu. Verkollisessa ympäristössä aja npm install, jotta saat myös oman lukitustiedoston. Käytetty Next.js-versio vastaa paikallista asennusta; päivitä ajantasaiseen korjattuun versioon ennen julkaisua.
