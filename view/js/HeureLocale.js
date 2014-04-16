function HeureLocale(date)
{
	heure = date.toLocaleTimeString();
	document.getElementById(id).innerHTML = "Heure du serveur : " + heure;
}