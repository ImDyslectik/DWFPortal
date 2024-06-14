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
DATABASE_URI=mongodb://localhost:27017/Naam...
EMAILSERVICE_USERNAME=
EMAILSERVICE_PASSWORD=
USE_MAIL_SERVICE=true/false
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=wachtwoord
INACTIVE_DAYS=
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

**Run Application** <br>
Na het instellen van de (optionele) emailservice en de .env file kan de applicatie geopend worden in de IDE.
Na het openen en navigeren naar het project in de terminal kan het volgende commando gerunt worden:

``npm install``

Na het installeren van alle packages kan het project gerunt worden met de volgende command:

```npm Server.js```
