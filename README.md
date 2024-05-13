# DWFPortal

Om de applicatie volledig te kunnen gebruiken, zorg ervoor dat je het `.env`-bestand invult 
met je `CLIENT_ID` en `CLIENT_SECRET` van de HubSpot API, samen met de juiste scope voor je project. 
Daarnaast moet je het pad naar je MongoDB-database toevoegen. Zorg er tot slot voor dat de HubSpot API wordt
omgeleid naar `https://yourserver/code` of wijzig de code zelf om aan je eigen behoeften te voldoen.

**.env**
hieronder is een niet ingevult voorbeeld van het environment bestand waarin de configuratie voor
de applicatie grotendeels geregeld wordt.
```
PORT=3000
API_HOST=api.hubspot.com
REDIRECT_URI=http://localhost:3000/code
CLIENT_ID=
CLIENT_SECRET=
DATABASE_URI=mongodb://localhost:27017/database
SCOPE=crm.schemas.deals.read 
```

**Notification services:** <br>
Het verzenden van de emails gaat via gmail hun SMTP service. voor het configureren hiervan
zal de beheerder zijn/haar email moeten invullen in de .env file en daarnaast de volgende
stappen uitvoeren in de gmail webinterface:

* Ga naar je Google-account.
* Selecteer 'Beveiliging'.
* Onder 'Hoe je inlogt bij Google' selecteer je '2-staps-verificatie'.
* Onderaan de pagina selecteer je 'App-wachtwoorden'.
* Voer een naam in die je helpt herinneren waar je het app-wachtwoord zult gebruiken.
* Selecteer 'Genereren'.
* Volg de instructies op het scherm om het app-wachtwoord in te voeren. Het app-wachtwoord is de 16-cijferige code die wordt gegenereerd op je apparaat.
* Selecteer 'Gereed'.