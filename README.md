# DWFPortal

Om de applicatie volledig te kunnen gebruiken, zorg ervoor dat je het `.env`-bestand invult 
met je `CLIENT_ID` en `CLIENT_SECRET` van de HubSpot API, samen met de juiste scope voor je project. 
Daarnaast moet je het pad naar je MongoDB-database toevoegen. Zorg er tot slot voor dat de HubSpot API wordt
omgeleid naar `https://yourserver/code` of wijzig de code zelf om aan je eigen behoeften te voldoen.

Hier is een voorbeeld van het `.env`-bestand.
```
PORT=3000
API_HOST=api.hubspot.com
REDIRECT_URI=http://localhost:3000/code
CLIENT_ID=
CLIENT_SECRET=
DATABASE_URI=mongodb://localhost:27017/database
SCOPE=crm.schemas.deals.read `````
