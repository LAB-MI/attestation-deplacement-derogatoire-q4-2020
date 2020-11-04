import {generatePdf} from "../src/js/pdf-util.js"

window.addEventListener("load", async () => {

	document.body.innerHTML += "initialisation du cluster ...<br/>";

	let infos = Object.fromEntries(new URLSearchParams(location.search)), 
		date = moment().subtract(infos.minutes || 10, "minutes");
	
	document.body.innerHTML += "création de l'attestation...<br/>";

	let blob = new Blob([await generatePdf({...infos, datesortie: date.format("DD[/]MM[/]YYYY"), heuresortie: date.format("HH[:]mm")}, infos.motif || "achats", "src/certificate.pdf", date)], {type: "application/pdf"}), 
		link = document.createElement("a");

	document.body.innerHTML += "téléchargement ...";

	link.href = window.URL.createObjectURL(blob);
	link.download = "attestation-" + date.format("YYYY[-]MM[-]DD[_]HH[-]mm") + ".pdf";
	link.click();
	
});