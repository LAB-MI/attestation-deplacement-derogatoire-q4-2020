import {generatePdf} from "../src/js/pdf-util.js"

window.addEventListener("load", async () => {

	document.body.innerHTML += "covid rapide<br/>initialisation du cluster<br/>";

	let infos = Object.fromEntries(new URLSearchParams(location.search));

	if(Object.keys(infos).length !== 9) return document.body.innerHTML += "info manquantes<br/>";
	
	document.body.innerHTML += "édition de l'attestation<br/>";

	let date = moment().subtract(infos.minutes || 10, "minutes"), 
		blob = new Blob([await generatePdf({...infos, datesortie: date.format("DD[/]MM[/]YYYY"), heuresortie: date.format("HH[:]mm")}, infos.motif || "achats", "src/certificate.pdf", date)], {type: "application/pdf"}), 
		link = document.createElement("a");

	link.href = window.URL.createObjectURL(blob);
	link.download = "attestation-" + date.format("YYYY[-]MM[-]DD[_]HH[-]mm") + ".pdf";
	link.click();

	document.body.innerHTML += "ok<br/>";
	
});