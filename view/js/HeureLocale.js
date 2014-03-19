function HeureLocale(id)
{
	date = new Date();
	heure = date.toLocaleTimeString();
	document.getElementById(id).innerHTML = heure;
	setTimeout('HeureLocale("'+id+'");','1000');
	return true;
}