import {generatePdf} from "../src/js/pdf-util.js"

window.addEventListener("load", async () => {

	document.write("initialisation du cluster ...<br/>");

	let params = window.location.search.substring(1).split("&").map(val => val.split("=")).reduce((acc, val) => ({...acc, [val[0]]: val[1]}), {}), 
		{name = "default", motif = "achats", minutes = 10} = params, 
		date = moment().subtract(minutes, "minutes"), 
		conf = await fetch("patch/profiles/" + name + ".json");

	if(!conf.ok) conf = await fetch("patch/profiles/default.json"); 

	document.write("création de l'attestation...<br/>");

	let infos = await conf.json(), 
		profile = {
			...infos, 
			datesortie: date.format("DD[/]MM[/]YYYY"), 
			heuresortie: date.format("HH[:]mm")
		}, 
		blob = new Blob([await generatePdf(profile, motif, "src/certificate.pdf", date)], {type: "application/pdf"}), 
		link = document.createElement("a");

	document.write("téléchargement ...");

	link.href = window.URL.createObjectURL(blob);
	link.download = "attestation-" + date.format("YYYY[-]MM[-]DD[_]HH[-]mm") + ".pdf";
	link.click();
	
});