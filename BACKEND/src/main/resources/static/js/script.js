
var url = "/CPep_Spring/"

var user = "1"
var s = 'Germany';
var _limit = '5';

// USER

var _userAnrede = "";
var _useremail = "";
var _userNachname = "";
var _userVorname = "";
var _userId = "";
var _userRolle = "";
var _userPasswort = "";
var _userFirmenId = "";
var _pdfs = [];



// USER
const $valueSpan = $('.valueSpan');
const $value = $('#customRange2');

var sortierung = 'Beides';
var exakteSuche = 'ja';
var welcheListe = "nurPep";

var unbekannt = [];



var firmenId;
var fId;
var neueFirma = [];
var _id_kunde_bearbeiten;
var _id_firma;
var firmenName;


const switchers = [...document.querySelectorAll('.switcher')]


var offen = false;

var dataArray1 = [
    {
        "city": "Beijing",
        "value": 132
    },
    {
        "city": "Shanghai",
        "value": 422
    },
    {
        "city": "Chengdu",
        "value": 232
    },
    {
        "city": "Wuhan",
        "value": 765
    },
    {
        "city": "Tianjin",
        "value": 876
    },
    {
        "city": "Guangzhou",
        "value": 453
    },
    {
        "city": "Hongkong",
        "value": 125
    }
];

var settings1 = {
    "dataArray": dataArray1,
    "itemName": "city",
    "valueName": "value",
    "callable": function (items) {
        console.dir(items)
    }
};


$(function () {
	
	
	

	  
	$("#betrag").val("15.00");

	 $(".valueSpan").text($('#customRange2').val());

	switchers.forEach(item => {
		item.addEventListener('click', function() {
			switchers.forEach(item => item.parentElement.classList.remove('is-active'))
			this.parentElement.classList.add('is-active')
		})
	})


	logIn();

	
	$("#email").focus();
		
	
	
	$("#sucheNach").keypress(function (e) {

		
		
		if (e.which == 13) {
			if ($(this).val().length > 3) {


				
				hierIstDieSuchFunktion();

			}

			return false;    // <---- Add this line
		}
	});



	$(".dropdown-menu a").on('click', function () {
		$("#dropdownMenuButton").text($(this).text());
		
		sortierung = $(this).text();
		
		
		
		if(sortierung == "Weiblich")
			{
			sortierung = "Female";
			
			}
		else if(sortierung == "Männlich"){
			sortierung = "Male";
		}
		else{
			sortierung = "Beides";
		}
		

		hierIstDieSuchFunktion();
	});

	
	
	 
	
});


	 


$("#kundenUbernehmen").click(function(){
	
	
	var kAnrede = $("#neuKundeAnrede").val();
	var kVorname = $("#neuKundeVorname").val();
	var kNachname = $("#neuKundeNachname").val();
	var kEmail = $("#neuKundeEmail").val();
	
	
	var firmenId = $("#firmenId").val();
	

	
	if(kVorname != "" && kNachname != "" && kEmail != "" && kAnrede != "")
		{

		neueFirma.push(kEmail);
		
		$.post(url +"neuerKundeZuFirmaHinzufuegen",{firmenId:firmenId, anrede: kAnrede,vorname:kVorname,nachname:kNachname,email:kEmail},function(){
			
		}).done(function(data){
			$("#bereitsHinzugefuegt").empty();
			getCustomers();
			$.each(data,function(key,value){
				$("#bereitsHinzugefuegt").append("<li>"+value.anrede  + " " + value.nachname + ", " + value.vorname + " <i class='fa fa-trash' aria-hidden='true'></i></li>");
			});
			
			$("#neuKundeAnrede").val("");
			$("#neuKundeVorname").val("");
			$("#neuKundeNachname").val("");
			$("#neuKundeEmail").val("");

			
		

		});
	
		
		}
	
});



$("#firmaAnlegen").click(function(){
	
	var fName = $("#firmenname").val();
	fId = $("#firmenId").val();

	$(".firma").empty();
	
	if(fName != "" && fId != "" )
		{
		$.post(url +"neueFirma",{firmenName: fName,firmenId:fId},function(){
			
		}).done(function(data){
			
			
			if(data[0].Fehler != null)
				{
				alert(data[0].Fehler);
				return;
				}
			
			$(".firma").append("<h5>Firma: "+data[0].firma+" ( " + data[0].firmen_id + " )</h5>");

		
			
			$('#collapseExample').collapse('toggle');
			
		});
			
		}
	else
		{
		alert("Bitte füllen Sie beide Felder aus");
		}
});






$("#neuerKunde").click(function(){
	

	
	$("#settingModal").css({"z-index":"999"})
	$("#neueFirmaModal").modal('show');
	
});




$("#neueFirmaSchließen").click(function(){
	
	
	var firmaHatKunden = neueFirma.length;
	
	var ausgeklappt = $('#collapseExamplefirmaLoeschen').hasClass("show");
	
	if(firmaHatKunden < 1 && ausgeklappt)
		{
		alert("Achtung: Sie können keine Firma anlegen, ohne mindestens einen Kunden hinzuzufügen.");
		return;
		}
	else{
		$('#collapseExample').collapse('hide');
		$("#firmenname").val("");
		$("#firmenId").val("");
		$("#neueFirmaModal").modal('hide');
		$("#settingModal").css({"z-index":"9999"});
		neueFirma = [];
	}
	
	
	
	
	

})



$("#pwAnfordern").click(function(evt){
	
	evt.stopPropagation();
	
	var email1 = $("#signup-email").val();
	var email2 = $("#signup-email-wiederholen").val();
	
	var loading = "<div class='spinner-grow text-primary' role='status'> <span class='sr-only'>Lädt...</span></div>"

	
	if(email1 == email2)
		{
		$(".btn-passwort").hide();
		$(".btnPw").append(loading);
		$.get(url+"PasswortAnfordern",{email: email1},function(){
			
		}).done(function(data){
			
			$.notify(data, "info");
			$(".btnPw .spinner-grow").remove();
			$(".btn-passwort").show();
		});
		}
	else{
		alert("Email stimmt nicht überein");
	}
});


function hierIstDieSuchFunktion(){

	
	s = $("#sucheNach").val();
	
	if(s.length > 3)
	{
	$.ajax({
		url: url + 'searchPep',
		type: 'GET',
		data: { suche: s,sortierungNach:sortierung,_exakteSuche : exakteSuche,liste: welcheListe },
		beforeSend: function () {
			
			
			$(".unbekannt").hide();
			$("#inhalt").empty();
			$(".scroll-wrap").empty();
			$("#load").show();
		
			loading();
			
			$(".list-group").empty();
			

		},
		success: function (data) {

		

			$.each(data, function (key, pep) {

				var res;
				
				
				if(pep.Unbekannt == 'Ja')
				{
					
					
					if(pep.id != null)
					{
					unbekannt.push(pep.id);
					
					var unbekanntListe = "<li class='list-group-item'>ID: "+pep.id+"</li>";
					
					$(".list-group").append(unbekanntListe);
					
					}
					
				}
				else if(pep.Unbekannt == 'Nein')
					{
				
				
				if (pep.code != null) {
					res = pep.code.slice(0, 2).toLowerCase();

				}
				else {
					res = "-";
				}
				
				

				var src = "src='/CPep_Spring/img/flaggen/" + res + ".png' ";

				var gender = null;
				if (pep.gender == 'Male') {
					gender = "<i class='fa fa-male' title='Maennlich' data-toggle='tooltip' data-placement='auto'></i>  Männlich</span>"
				}
				else {
					gender = "<i class='fa fa-female' title='Weiblich'´data-toggle='tooltip' data-placement='auto'></i> Weiblich</span>"
				}
				
				
				var additional_Information = null;
				
				if (pep.additional_Information == "") {
					additional_Information = "<i class='fa fa-info' title='Keine Informationen' data-toggle='tooltip' data-placement='auto'></i></span>"
				}
				else {
					additional_Information = "<i class='fa fa-info' title='"+pep.additional_Information+"' data-toggle='tooltip' data-placement='auto'></i></span>"
				}
				
				

				var dob = null;
				
				if (pep.dob == "") {
					dob = " ---"
				}
				else {
					dob = pep.dob;
				}	

				var card = "<div class='col-md-6 col-xs-6 col-lg-2 card__ "+pep.id+"' >" 
					+"<a class='grid__item' href='#' >"
					+ "<h2 class='title title--preview' >" + pep.first_Name + "</h2>"
					+ "<div class='loader'></div> <span class='category'>" + pep.last_Name + "</span>"
					+ "<div class='meta meta--preview'>"
					+ "<div class='img'>"
					+ "<img  class='meta__avatar' " + src + "alt='"+pep.id+"'  onerror=\"imgError('" + pep.code + "',this)\" />"
					
					+ "</div>"
					+ "<span class='meta__date' ><i class='fa fa-birthday-cake'></i>" + pep.dob + "</span>"
					+ "<span class='meta__code'  ><i class='fa fa-globe'></i>" + (pep.code == null ? '---' : pep.code )+ "</span>"
					+ "<span class='meta__reading-time' ><i class='fa fa-flag' ></i>" + (pep.country == null ? '---' : pep.country ) + "</span>"
					+ "<button style='width:100%; margin-top:9px;' data-pepid='"+pep.id+"' data-firmenId='"+_userFirmenId+"' class='btn btn-dark getPdf__'>PDF</button>"
					+ "</div>"
					+ "</a>"					
					+"</div>";



				var artikel = "<article class='content__item' >"
					+ "<span class='category category--full'>" + pep.last_Name + "</span>"
					+ "<h2 class='title title--full'>" + pep.first_Name + "</h2>"
					+ "<div class='meta meta--full'>"
					+ "<button data-pepid='"+pep.id+"' data-firmenId='"+_userFirmenId+"' class='btn btn-primary getPdf__  style__btn_primary' >PDF</button>"
					+ "<img class='meta__avatar' " + src + " onerror=\"imgError('" + pep.code + "',this)\" alt='"+pep.id+"' />"
					+ "<span class='meta__author'>" + dob + "</span> <span class='meta__date' style='width: 10%;'>" + gender + " | " +  additional_Information
					+ "<span class='meta__reading-time' style='width:100px;' ><i class='fa fa-flag'></i>" + pep.country + "</span>"
					+ "</div>"
					
					+"<div class='inhalt__detail'>"
					+ "<p ><span >Full Name:</span></p><p class='details'> " + (pep.full_Name != "" ? pep.full_Name : "---") + "</p>"
					+ "<p ><span style='font-size: 1.35em;'>Other Names:</span></p><p class='details'> " + (pep.other_Names != "" ? pep.other_Names : "---") + "</p>"
					+ "<p ><span >Function:</span></p><p class='details'> " + pep.function + "</p>"
					+ "<p ><span >Category:</span></p><p class='details'> " + pep.category + "</p>"
					+ "<p ><span >Pob:</span></p><p class='details'> " + pep.pob + "</p>"
					+ "<p ><span >Country Of Activity:</span> <a href='#'>" + pep.country_Of_Activity + "</a></p>"
					+ "<div>"
					+"<div class='muster'>Muster</div>"
					+ "</article>";

				
				
				$("#inhalt").append(card);
				$(".scroll-wrap").append(artikel);
				
				
				$('[data-toggle="tooltip"]').tooltip({
					container: 'body'
				});
				
				 
				 
				}



			});
		},
		error: function () {

		},
		complete: function () {

		
			
			$(".unbekannt").fadeIn();
			$("#load").hide();
			
			

			count();
			
			$(".getPdf__").click(function(evt){
				getPdf__(evt);
			});
			
			$.getScript("./js/main.js");
		
			
		}
	});
	}
}



$("#exakteSuche").click(function(){
	if($("#exakteSuche").is(':checked'))
		{
		exakteSuche = 'ja';
		$('#sucheNach').focus().trigger({ type : 'keypress', which : 13 });
		}
	else{
		exakteSuche = 'nein';
		$('#sucheNach').focus().trigger({ type : 'keypress', which : 13 });
	}
});


// $('#customRange2').change(function(){
//	
// $(".valueSpan").text($('#customRange2').val());
//	
// _limit = $('#customRange2').val();
//	  
//	  
// getUserAbfragen();
//	  
// })






$("#abmelden").click(function(){
	$.get(url + "logout",function(){
		logIn();
	});
});




$(".form-login").submit(function(e){
	

	
	var pw = $("#passwort").val();
	var mail = $("#email").val();
	
	
	var ergebnis = "";

	
	if(pw != "" && mail != "")
		{
		
		
		 
	$.ajax({
		url: url + "logIn",
		type: 'GET',
		data: { passwort: pw,email: mail },
		
		beforeSend: function () {
			
		},
		success: function (data) {


			if(data.length > 0)
				{
			$.each(data, function (key, user) {
				
				_useremail = user.email;
				_userNachname = user.nachname;
				_userVorname = user.vorname;
				_userId = user._id;
				_userRolle = user.rolle;
				_userPasswort = user.passwort;
				_userAnrede = user.anrede;
				_userFirmenId = user.firmen_id
				
				

				
				
				$("#userid").text(_userAnrede + " " + _userNachname);

			});
				}
			else{
				
				$("#hinweis").text("Falsche Passwort / EMail- Kombination");
		
			}
		},
		error: function () {

		},
		complete: function () {
			
			
			listePdfs();
		
			
			$(".wrapper").fadeIn();
			$("#bisherBtn").show();
			
			
			$.getJSON('https://ipapi.co/json/', function(data) {
				
				  ergebnis = (JSON.stringify(data, null, 2));
				 
					
			}).done(function() {

			
					$.ajax({
						  url: url + "saveLogIn",
						  type: "post",					 
						  data: { daten: ergebnis,userId: _userId },
						
						beforeSend: function () {
							
						},
						success: function () {


						},
						error: function () {

						},
						complete: function () {
							
				
						}
					});
				 
			});
			
		
			
			
			$("#passwort").val("");
			$("#email").val("");
			
			if(_userId != null && _userId != '')
				{
				
				
				$('body').css({"background":"white"});
				
				$(".forms-section").hide();
			
								
				init();
				}
			else
				{
				$("#hinweis").text("Falsche Passwort / EMail- Kombination");
				}
			
		
			

	
	
		}
	});
	}
	
	return false;
});



function listePdfs(){
	
	var loading = "<div class='spinner-grow text-primary' role='status'> <span class='sr-only'>Lädt...</span></div>"

	$(".bisherpdfAbfragen").empty();
	
	$(".bisherpdfAbfragen").append(loading);
	
	$.get(url+"getKundenAbfragen",{email:_useremail},function(){
				
			}).success(function(data){
				
				
				$(".bisherpdfAbfragen .spinner-grow").remove();
				
				
				$.each(data, function (key, user) {
					
					
					if(user.pdfID != null)
						{
						
						$(".bisherpdfAbfragen").append("<span style='font-size: 2em; color: Tomato;cursor:pointer;' class='openPdf' title='"+user.datum +" : "+user.suchteNach+"' data-pdfId='"+user.pdfID+"'><i  class='fas fa-file-pdf fa-2x'></i></span>");
						}
					

				})
			});
}






$(document).on("click",".openPdf",function(){
	
	
	
	   var p = $(this).attr("data-pdfId");
	
	  
		var req = new XMLHttpRequest();
		req.open("GET", url + "OpenPdf?_id=" + p,
						true);
		req.responseType = "blob";
		req.onreadystatechange = function() {
		
			if (req.readyState === 4 && req.status === 200) {
				var blob = req.response;
			

				// test for IE
				if (window.navigator && window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveOrOpenBlob(blob, "PdfName-"+ new Date().getTime() + ".pdf");
				} else {
				

					var link = document.createElement('a');
					
					link.href =(window.URL || window.webkitURL || window || {}).createObjectURL(req.response);
					 var objectUrl = (window.URL || window.webkitURL || window || {}).createObjectURL(req.response);
					 link.target = '_blank'; 
					document.body.appendChild(link);		
				
					link.download = "PdfName-" + new Date().getTime() + ".pdf";

					// append the link to the document body
					$("body").append(link);
					
				
					link.click();
					
					URL.revokeObjectURL(link.href);
				}
			}
			
		}
			  
		req.send();
	 
	
// // test for IE
// if (window.navigator && window.navigator.msSaveOrOpenBlob) {
// window.navigator.msSaveOrOpenBlob(p, "PdfName-"+ new Date().getTime() +
// ".pdf");
// } else {
//		
//
// var link = document.createElement('a');
//			
// link.href =(window.URL || window.webkitURL || window ||
// {}).createObjectURL(p);
// var objectUrl = (window.URL || window.webkitURL || window ||
// {}).createObjectURL(p);
// link.target = '_blank';
// document.body.appendChild(link);
//		
// link.download = "PdfName-" + new Date().getTime() + ".pdf";
//
// // append the link to the document body
// $("body").append(link);
//			
//		
// link.click();
//			
// URL.revokeObjectURL(link.href);
// }

});


function getPdf__(evt){
	

	evt.stopPropagation();

	
	if(evt.target.attributes[1].name == "data-pepid")
		{
		_id = evt.target.attributes[1];
		}
	else
		{
		_id = evt.target.attributes[0];
		}
	

	
	
	var suche_ = $("#sucheNach").val();
	
	
	var s;
	if(suche_ == "")
		{
		s = "---";
		}
	else{
		s = suche_;
	}


	
	var req = new XMLHttpRequest();
	req.open("GET", url + "getPdf?_id=" + _id.value + "&gesuchtNach=" + s+"&firmenId="+_userFirmenId+"&kundenId="+_userId,
					true);
	req.responseType = "blob";
	req.onreadystatechange = function() {
	
		if (req.readyState === 4 && req.status === 200) {
			var blob = req.response;
		

			// test for IE
			if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, "PdfName-"+ new Date().getTime() + ".pdf");
			} else {
			

				var link = document.createElement('a');
				
				link.href =(window.URL || window.webkitURL || window || {}).createObjectURL(req.response);
				 var objectUrl = (window.URL || window.webkitURL || window || {}).createObjectURL(req.response);
				 link.target = '_blank'; 
				document.body.appendChild(link);		
			
				link.download = "PdfName-" + new Date().getTime() + ".pdf";

				// append the link to the document body
				$("body").append(link);
				
			
				link.click();
				
				URL.revokeObjectURL(link.href);
				
				listePdfs();
			}
		}
		
	}
		  
	req.send();

	
	
}



function count(){
	 var n = $( ".grid__item" ).length;
	 
	 
	 $("#wieviele").text(n);
	 
	 $(".willkommen").text("Willkommen " + _userAnrede + " " + _userVorname + " " + _userNachname);
	 
	 
}

function ajaxCalls(which,daten){
	
	var suchFeld = $("#sucheNach").val();
	if(suchFeld != "")
		{
	$.ajax({
		url: url + which,
		type: 'POST',
		data: { sortierung: daten,suche: s },
		beforeSend: function () {
			$("#inhalt").empty();
			$(".scroll-wrap").empty();
			$("#load").show();	
			$(".field-container").hide();
		
			loading();
		},
		success: function (data) {


			$.each(data, function (key, pep) {

				var res;
				if (pep.code != null) {
					res = pep.code.slice(0, 2).toLowerCase();

				}
				else {
					res = "-";
				}

				var src = "src='/CPep_Spring/img/flaggen/" + res + ".png' ";

				var gender = null;
				if (pep.gender == 'Male') {
					gender = "<i class='fa fa-male' title='Maennlich' data-toggle='tooltip' data-placement='auto'></i>  Männlich</span>"
				}
				else {
					gender = "<i class='fa fa-female' title='Weiblich'´data-toggle='tooltip' data-placement='auto'></i> Weiblich</span>"
				}
				
				var additional_Information = null;
				
				if (pep.additional_Information == "") {
					additional_Information = "<i class='fa fa-info' title='Keine Informationen' data-toggle='tooltip' data-placement='auto'></i></span>"
				}
				else {
					additional_Information = "<i class='fa fa-info' title='"+pep.additional_Information+"' data-toggle='tooltip' data-placement='auto'></i></span>"
				}

				

				var dob = null;
				
				if (pep.dob == "") {
					dob = " ---"
				}
				else {
					dob = pep.dob;
				}	
				
				var card = "<div class='col-md-3 col-xs-3 col-lg-2 card__'>" 
					+"<a class='grid__item' href='#' >"
					+ "<h2 class='title title--preview' title='"+pep.first_Name+"' data-toggle='tooltip' data-placement='auto'>" + pep.first_Name + "</h2>"
					+ "<div class='loader'></div> <span class='category'>" + pep.last_Name + "</span>"
					+ "<div class='meta meta--preview'>"
					+ "<div class='img'>"
					+ "<img  class='meta__avatar' " + src + "alt='"+pep.id+"' data-toggle='tooltip' data-placement='top' title='" + pep.country + "' onerror=\"imgError('" + pep.code + "',this)\" />"
					
					+ "</div>"
					+ "<span class='meta__date' title='" + pep.dob + "' data-toggle='tooltip' data-placement='right'><i class='fa fa-birthday-cake'></i>" + pep.dob + "</span>"
					+ "<span class='meta__code'  title='" + pep.code + "' data-toggle='tooltip' data-placement='right'><i class='fa fa-globe'></i>" + pep.code + "</span>"
					+ "<span class='meta__reading-time' data-toggle='tooltip' data-placement='right' title='" + pep.country + "'><i class='fa fa-flag' ></i>" + pep.country + "</span>"
					+ "<button style='width:100%; margin-top:9px;' data-pepid='"+pep.id+"' data-firmenId='"+_userFirmenId+"' class='btn btn-dark getPdf__'>PDF</button>"
					+ "</div>"
					+ "</a>"					
					+"</div>";



				var artikel = "<article class='content__item' >"
					+ "<span class='category category--full'>" + pep.last_Name + "</span>"
					+ "<h2 class='title title--full'>" + pep.first_Name + "</h2>"
					+ "<div class='meta meta--full'>"
					+ "<button data-pepid='"+pep.id+"' data-firmenId='"+_userFirmenId+"' class='btn btn-primary getPdf__  style__btn_primary' >PDF</button>"
					+ "<img class='meta__avatar' " + src + " onerror=\"imgError('" + pep.code + "',this)\" alt='"+pep.id+"' />"
					+ "<span class='meta__author' title='DOB' data-toggle='tooltip'>" + dob + "</span> <span class='meta__date' style='width: 10%;'>" + gender + " | " +  additional_Information
					+ "<span class='meta__reading-time' style='width:100px;' data-toggle='tooltip' data-placement='top' title='" + pep.country + "'><i class='fa fa-flag'></i>" + pep.country + "</span>"
					+ "</div>"
					
					+"<div class='inhalt__detail'>"
					+ "<p ><span >Full Name:</span></p><p class='details'> " + (pep.full_Name != "" ? pep.full_Name : "---") + "</p>"
					+ "<p ><span style='font-size: 1.35em;'>Other Names:</span></p><p class='details'> " + (pep.other_Names != "" ? pep.other_Names : "---") + "</p>"
					+ "<p ><span >Function:</span></p><p class='details'> " + pep.function + "</p>"
					+ "<p ><span >Category:</span></p><p class='details'> " + pep.category + "</p>"
					+ "<p ><span >Pob:</span></p><p class='details'> " + pep.pob + "</p>"
					+ "<p ><span >Country Of Activity:</span> <a href='#'>" + pep.country_Of_Activity + "</a></p>"
					+ "<div>"
					+"<div class='muster'>Muster</div>"
					+ "</article>";



				$("#inhalt").append(card);
				$(".scroll-wrap").append(artikel);



				$('[data-toggle="tooltip"]').tooltip({
					container: 'body'
				});



			});
		},
		error: function () {

		},
		complete: function () {

			$("#load").hide();
			
	
			$(".field-container").show();

			
			count();
			
			$(".getPdf__").click(function(evt){
				getPdf__(evt);
			});
			
			
			$.getScript("./js/main.js");
		}
	});
		}
	else{
		alert("Suchfeld darf nicht leer sein");
	}
}

function loading(){
	function Ticker(elem) {
		elem.lettering();
		this.done = false;
		this.cycleCount = 5;
		this.cycleCurrent = 0;
		this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');
		this.charsCount = this.chars.length;
		this.letters = elem.find('span');
		this.letterCount = this.letters.length;
		this.letterCurrent = 0;

		this.letters.each(function () {
			var $this = $(this);
			$this.attr('data-orig', $this.text());
			$this.text('-');
		});
	}

	Ticker.prototype.getChar = function () {
		return this.chars[Math.floor(Math.random() * this.charsCount)];
	};

	Ticker.prototype.reset = function () {
		this.done = false;
		this.cycleCurrent = 0;
		this.letterCurrent = 0;
		this.letters.each(function () {
			var $this = $(this);
			$this.text($this.attr('data-orig'));
			$this.removeClass('done');
		});
		this.loop();
	};

	Ticker.prototype.loop = function () {
		var self = this;

		this.letters.each(function (index, elem) {
			var $elem = $(elem);
			if (index >= self.letterCurrent) {
				if ($elem.text() !== ' ') {
					$elem.text(self.getChar());
					$elem.css('opacity', Math.random());
				}
			}
		});

		if (this.cycleCurrent < this.cycleCount) {
			this.cycleCurrent++;
		} else if (this.letterCurrent < this.letterCount) {
			var currLetter = this.letters.eq(this.letterCurrent);
			this.cycleCurrent = 0;
			currLetter.text(currLetter.attr('data-orig')).css('opacity', 1).addClass('done');
			this.letterCurrent++;
		} else {
			this.done = true;
		}

		if (!this.done) {
			requestAnimationFrame(function () {
				self.loop();
			});
		} else {
			setTimeout(function () {
				self.reset();
			}, 500);
		}
	};

	$words = $('.word');

	$words.each(function () {
		var $this = $(this),
			ticker = new Ticker($this).reset();
		$this.data('ticker', ticker);
	});
}





function logIn(){
	
	$("#bisherBtn").hide();
	$(".wrapper").hide();
	$("#exportBtn").hide();
	$("#formExakteSuche").hide();
	$(".tooltip").tooltip("hide");
	$("#load").hide();
	$(".page-meta").hide();
	$("#theSidebar").hide();
	$(".top-bar").hide();
	$("#theGrid").hide();
	$("#menu-toggle").hide();
	$("body").css({"background": "white"});
	$(".forms-section").show();
	



}

function init() {
	

	
	if(_userRolle == 'Admin')
		{
		$(".settings").show();
		}
	else{
		$(".settings").hide();
	}
	
	$(".unbekannt").hide();
	
	
	// hamburger menu button (mobile) and close cross
	$(".menu-toggle").click(function() {
		if( !$(".sidebar").hasClass('sidebar--open') ) {
			$(".sidebar").addClass('sidebar--open');	
		}
	});
	
	
	$(".close-button").click(function() {
		if($(".sidebar").hasClass('sidebar--open') ) {
			$(".sidebar").removeClass('sidebar--open');
		}
	});


	
	$(".icon-close").click(function(){
		 $('body').removeClass('is-focus is-type');
		$("#sucheNach").val("");
		
	});
	


	  
	  $('.field').on('blur', function() {
	    $('body').removeClass('is-focus is-type');
	  });

	  


	  getCountry();
}


$(".settings").click(function(){
	getChart();
	$("#settingModal").modal('show');
});

$(".zeigeFirmen").click(function(){
	getCustomers();
});

$(".uebersicht").click(function(){
	getChart();
});



function getChart(){
	
	var loading = "<div class='spinner-grow text-primary' role='status'> <span class='sr-only'>Lädt...</span></div>"
	
	$("#loadingChartProFirma").append(loading);
	
	var daten = [];
	var monate = [];
	var firmen = [];
	var abfrageFirma = [];
	var farben = [];
	
	$.get(url+"chartGesamt",function(data){
		
		$.each(data,function(key,val){
			daten.push(val.ANZAHL);
			
			
			switch(val.Monat) {
			  case 1:
				  monate.push("Januar");
			    break;
			  case 2:
				  monate.push("Februar");
			    break;
			  case 3:
				  monate.push("März");
			    break;
			  case 4:
				  monate.push("April");
			    break;
			  case 5:
				  monate.push("Mai");
			    break;
			  case 6:
				  monate.push("Juni");
			    break;
			  case 7:
				  monate.push("Juli");
			    break;
			  case 8:
				  monate.push("August");
			    break;
			  case 9:
				  monate.push("September");
			    break;
			  case 10:
				  monate.push("Oktober");
			    break;
			  case 11:
				  monate.push("November");
			    break;
			  case 12:
				  monate.push("Dezember");
			    break;
			  default:
				  monate.push(val.Monat);
			}
			
		});
		
		
		
		$.get(url+"chartProFirma",function(data){
			
			$.each(data,function(key,val){
				
				r = Math.floor(Math.random() * 200);
				g = Math.floor(Math.random() * 200);
				b = Math.floor(Math.random() * 200);
				color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
				
				farben.push(color);
				abfrageFirma.push(val.ANZAHL);
				firmen.push(val.firmen_id);
		
				
			});
		
	
		
		
		var ctx = document.getElementById('settingChart').getContext('2d');
		var chart = new Chart(ctx, {
		    // The type of chart we want to create
		    type: 'line',

		    // The data for our dataset
		    data: {
		        labels: monate,
		        datasets: [{
		            label: 'Abfragen (Gesamt)',
		           
		            borderColor: 'rgb(255, 99, 132)',
		            data: daten
		        }]
		    },

		    // Configuration options go here
		    options: {}
		});
		
		
	
		
		
		
		var ctxPie = document.getElementById('proFirma').getContext('2d');
		var pieChart = new Chart(ctxPie, {
		    type: 'pie',
		    data: {
		    	   
		        datasets: [{
		                      
		        	backgroundColor:farben,
		            data: abfrageFirma
		        }],
		        labels: firmen
		    },

		    // Configuration options go here
		    options: {}
		    
		});
		
		});
		

		
		
	}).done(function(){
		$("#loadingChartProFirma .spinner-grow").remove();
	});
		

	

}




$("#rechnungJetztErstellen").click(function(){
	
	
	var schluessel = $("#betrag").val();
	
	var req = new XMLHttpRequest();
	req.open("GET", url + "PDF_Rechnung?firmen_id=" + firmenId+"&berechnungsschluessel="+schluessel,
					true);
	req.responseType = "blob";
	req.onreadystatechange = function() {
	
		if (req.readyState === 4 && req.status === 200) {
			var blob = req.response;
		

			// test for IE
			if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, "PdfName-"+ new Date().getTime() + ".pdf");
			} else {
				
			
				

				var link = document.createElement('a');
				
				link.href =(window.URL || window.webkitURL || window || {}).createObjectURL(req.response);
				 var objectUrl = (window.URL || window.webkitURL || window || {}).createObjectURL(req.response);
				 link.target = '_blank'; 
				document.body.appendChild(link);		
			
				link.download = "PdfName-" + new Date().getTime() + ".pdf";

				// append the link to the document body
				$("body").append(link);
				
			
				link.click();
				
				URL.revokeObjectURL(link.href);
			}
		}
		
	}
		  
	req.send();

	
	
	$.get(url+"PDF_Rechnung",{firmen_id: firmenId},function(){
		
	});
});

function getCustomers(){
	
 	
	var l = "";
	
	var loading = "<div class='spinner-grow text-primary' role='status'> <span class='sr-only'>Lädt...</span></div>"
	
	
	$.ajax({
		url: url + 'customers',
		type: 'GET',		
		beforeSend: function () {
	
			$("#firmenListe").empty();
			$("#firmenListe").append(loading);
		
		},
		success: function (data) {

			$("#firmenListe").empty();
			
			var b = "";
			
			$.each(data, function (key, firma) {
				
				
				b = "<button class='btn btn-warning dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Firma</button>"
					+"<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
					+"<a class='dropdown-item firmenRechnung' data-firmenId='"+firma.firmen_id+"' data-firmenName='"+firma.firma+"' href='#'>Rechnung</a>"
					+"<a class='dropdown-item firmaLoeschen' data-firmenId='"+firma.firmen_id+"' data-firmenName='"+firma.firma+"' href='#'>Löschen</a>"
					+"</div>";
			
				
				l += "<tr><td>"+firma.firma+"</td><td style='text-align:right; '><button type='button'  data-firmenId='"+firma.firmen_id+"' class='btn btn-info zeigeFirmenKunden'>Kunden<span style='margin-left: 10px!important;' class='badge badge-light' >"+firma.anzahlMitarbeiter+"</span></button></td>" +
				"<td>"+b+"</td></tr>"


			});
			
	
			
			
		},
		error: function () {

		},
		complete: function () {
			
			$("#firmenListe").append(l);
			 
		
			
			
			 $('#firmenTabelle').dataTable( {
				 retrieve: true,
				 autoWidt: true,
				 "language": {
					 "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"
			        }
				});
		
		
			
	
		}
	});
}

$(document).on("click", ".firmaLoeschen", function(){
	firmenId = $(this).attr("data-firmenId");
	
	firmenName = $(this).attr("data-firmenName");
	
	
	$(".textLoeschen").text("Wollen Sie wirklich die Firma '"+firmenName+"' löschen ? Damit gehen alle Daten sowie deren zugeordnete Kunden unwiederruflich verloren");
	$("#firmaEntf").modal("show");
	$("#settingModal").css({"z-index":"999"});
	
});


$(document).on("click", ".firmenRechnung", function(){
	
	
	firmenId = $(this).attr("data-firmenId");
	
	firmenName = $(this).attr("data-firmenName");
	
	var obj  = $("#firmenRechnungModal .modal-title").text("Rechnung für\n" + firmenName + "\nerstellen");
	obj.html(obj.html().replace(/\n/g,'<br/>'));
	
	
	$("#firmenRechnungModal").modal("show");
	$("#settingModal").css({"z-index":"999"});
	
});



$("#rechnungErstellenFirmaSchließen").click(function(){
	
		
	$("#firmenRechnungModal").modal("hide");
	$("#settingModal").css({"z-index":"9999"});
});



function firmenKunden(_id){
	
	
	var loading = "<div class='spinner-grow text-primary' role='status'> <span class='sr-only'>Lädt...</span></div>"

		
		
	var kundenTabelle = "";
		
	
	
	$.ajax({
		url: url + 'firmenKunden',
		type: 'GET',
		data:{firmenId: _id},
		beforeSend: function () {
	
			$("#zeigeFirmenK").empty();
			$("#zeigeFirmenK").append(loading);
		
		},
		success: function (data) {

			$("#zeigeFirmenK").empty();
					
			$.each(data, function (key, kunde) {

				kundenTabelle += "<tr><td>"+kunde.vorname+"</td><td>"+kunde.nachname+"</td><td>"+kunde.email+"</td><td><div class='dropdown'><button class='btn btn-info dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Kunde"
								  +"</button>"
								  +"<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
								    +"<a class='dropdown-item kundeLoeschen' href='#' data-firmenId='"+kunde.firmen_id+"' data-kundenId='"+kunde._id+"' >Löschen</a>"
								    +"<a class='dropdown-item kundeBearbeiten' href='#' data-firmenId='"+kunde.firmen_id+"' data-kundenId='"+kunde._id+"' >Bearbeiten</a>"
								  +"</div>"
								+"</div></tr>";
													

			});
			
	
			$("#zeigeFirmenK").append(kundenTabelle);
			
		},
		error: function () {

		},
		complete: function () {

			 $('#kundenEinerFirma').dataTable( {
				 retrieve: true,
				 autoWidt: true,
				 "language": {
					 "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"
			        }
				});
		
		
				$("#zeigeFirmenKModal").modal("show");
	
		}
	});
 
}

$(document).on("click", ".zeigeFirmenKunden", function(){
	
	_id_firma = $(this).attr("data-firmenId");
	
	$("#settingModal").css({"z-index":"999"});
	
	
		
	firmenKunden(_id_firma);
	

});



$(document).on("click", ".kundeBearbeiten", function(){
	
	_id_kunde_bearbeiten = $(this).attr("data-kundenId");
	
	
	$.get(url + "singleUser",{id: _id_kunde_bearbeiten},function(data){
		$("#bearbeitenVorname").val(data[0].vorname);
		$("#bearbeitenNachname").val(data[0].nachname);
		$("#bearbeitenEmail").val(data[0].email);
		$("#bearbeitenAnrede").val(data[0].anrede);
	}).done(function(){
		
		$("#zeigeFirmenKModal").css({"z-index":"999"});
		$("#bearbeitenModal").modal("show");
	});
	
	
	

});



$("#bearbeitenUebernehmen").click(function(){
	
	var an= $("#bearbeitenAnrede").val();
	var vor= $("#bearbeitenVorname").val();
	var nach = $("#bearbeitenNachname").val();
	var email = $("#bearbeitenEmail").val();
	
	$.post(url + "updateSingleUser",{kunden_id: _id_kunde_bearbeiten,anrede:an,vorname:vor,nachname:nach,email:email},function(data){
		
		firmenKunden(_id_firma);
		$("#zeigeFirmenKModal").css({"z-index":"9999"});
		$("#bearbeitenModal").modal("hide");
	});
})




$("#bearbeitenNichtUebernehmen").click(function(){
	$("#zeigeFirmenKModal").css({"z-index":"9999"});
	$("#bearbeitenModal").modal("hide");
});



$("#neuenKundenZuFirma").click(function(){
	$("#zeigeFirmenKModal").css({"z-index":"999"});
	$("#neuenKundenZuFirmaHinzufuegenModal").modal("show");
});

$("#neuKundeZusaetzlichSchließen").click(function(){
	$("#zeigeFirmenKModal").css({"z-index":"9999"});
	$("#neuenKundenZuFirmaHinzufuegenModal").modal("hide");
});




$("#neuKundeZusaetzlichUebernehmen").click(function(){
	
	var kAnrede = $("#neuKundeZusaetzlichAnrede").val();
	var kVorname = $("#neuKundeZusaetzlichVorname").val();
	var kNachname = $("#neuKundeZusaetzlichNachname").val();
	var kEmail = $("#neuKundeZusaetzlichEmail").val();
	

	
	if(kVorname != "" && kNachname != "" && kEmail != "" && kAnrede != "")
		{

			
		$.post(url +"neuerKundeZuFirmaHinzufuegen",{firmenId:_id_firma, anrede: kAnrede,vorname:kVorname,nachname:kNachname,email:kEmail},function(){
			firmenKunden(_id_firma);
			
			getCustomers();
			
			
			$("#neuKundeZusaetzlichAnrede").val("");
			$("#neuKundeZusaetzlichVorname").val("");
			$("#neuKundeZusaetzlichNachname").val("");
			$("#neuKundeZusaetzlichEmail").val("");
		});
	
		
		}
	
});



$(document).on("click", ".kundeLoeschen", function(){
	var id = $(this).attr("data-kundenId");
	var id_firma = $(this).attr("data-firmenId");
	
	$.post(url+"loescheKundeFromFirma",{kundenId: id},function(){
		
	}) .done(function(data) {
		firmenKunden(id_firma);
		getCustomers();
	})
});


$("#firmenKundenModalClose").click(function(){
	$("#zeigeFirmenKModal").modal("hide");
	$("#settingModal").css({"z-index":"9999"});
});


$("#nein").click(function(){
	$("#settingModal").css({"z-index":"9999"});
	$("#firmaEntf").modal("hide");
});


$("#jaFirmaEntfernen").click(function(){
	
	$.post(url + "firmaUndKundenEntfernen",{firmenID:firmenId},function(){
		
	}).done(function(){
		getCustomers();
		
		$("#firmaEntf").modal("hide");
		
		$("#settingModal").css({"z-index":"9999"});
	});
});




function getCountry(){
	
	
	
	
	$.ajax({
		url: url + 'getByCountry',
		type: 'POST',
		data: { country: s },
		beforeSend: function () {
			$("#load").show();
			$(".page-meta").show();
			$("#theGrid").show();
			$("#inhalt").empty();
			$(".scroll-wrap").empty();
			

			
			loading();
		
		},
		success: function (data) {


			$.each(data, function (key, pep) {


				var res = pep.code.slice(0, 2).toLowerCase();

				var src = "src='/CPep_Spring/img/flaggen/" + res + ".png' ";

				var gender = null;				
				
				
				if (pep.gender == 'Male') {
					gender = "<i class='fa fa-male' title='Maennlich' data-toggle='tooltip' data-placement='auto'></i>  Männlich</span>"
				}
				else {
					gender = "<i class='fa fa-female' title='Weiblich'´data-toggle='tooltip' data-placement='auto'></i> Weiblich</span>"
				}
				
				var additional_Information = null;
				
				if (pep.additional_Information == "") {
					additional_Information = "<i class='fa fa-info' title='Keine Informationen' data-toggle='tooltip' data-placement='auto'> --- </i></span>"
				}
				else {
					additional_Information = "<i class='fa fa-info' title='"+pep.additional_Information+"' data-toggle='tooltip' data-placement='auto'>"+pep.additional_Information+"</i></span>"
				}
				
				
				
				var dob = null;
				
				if (pep.dob == "") {
					dob = " ---"
				}
				else {
					dob = pep.dob;
				}	

				var card = "<div class='col-md-6 col-xs-6 col-lg-2 card__'>" 
					+"<a class='grid__item' href='#' >"
					+ "<h2 class='title title--preview'  title='"+pep.first_Name+"' >" + pep.first_Name + "</h2>"
					+ "<div class='loader'></div> <span class='category' title='"+pep.last_Name+"' >" + pep.last_Name + "</span>"
					+ "<div class='meta meta--preview'>"
					+ "<div class='img'>"
					+ "<img  class='meta__avatar' " + src + "alt='"+pep.id+"'  onerror=\"imgError('" + pep.code + "',this)\" />"					
					+ "</div>"
					+ "<span class='meta__date' ><i class='fa fa-birthday-cake'></i>" + pep.dob + "</span>"
					+ "<span class='meta__code'  title='" + pep.code + "'><i class='fa fa-globe'></i>" + pep.code + "</span>"
					+ "<span class='meta__reading-time'  title='" + pep.country + "'><i class='fa fa-flag' ></i>" + pep.country + "</span>"
					+ "<button style='width:100%; margin-top:9px;' data-pepid='"+pep.id+"' data-firmenId='"+_userFirmenId+"' class='btn btn-dark getPdf__'>PDF</button>"
					+ "</div>"
					+ "</a>"					
					+"</div>";
				
				

				var artikel = "<article class='content__item' >"
					+ "<span class='category category--full'>" + pep.last_Name + "</span>"
					+ "<h2 class='title title--full'>" + pep.first_Name + "</h2>"
					+ "<div class='meta meta--full'>"
					+ "<button data-pepid='"+pep.id+"' data-firmenId='"+_userFirmenId+"' class='btn btn-primary getPdf__  style__btn_primary' >PDF</button>"
					+ "<img class='meta__avatar' " + src + " onerror=\"imgError('" + pep.code + "',this)\" alt='"+pep.id+"' />"
					+ "<span class='meta__author' title='DOB' data-toggle='tooltip'>" + dob + "</span> <span class='meta__date' style='width: 10%;'>" + gender + " | " +  additional_Information
					+ "<span class='meta__reading-time' style='width:100px;' data-toggle='tooltip' data-placement='top' title='" + pep.country + "'><i class='fa fa-flag'></i>" + pep.country + "</span>"
					+ "</div>"
					
					+"<div class='inhalt__detail'>"
					+ "<p ><span >Full Name:</span></p><p class='details'> " + (pep.full_Name != "" ? pep.full_Name : "---") + "</p>"
					+ "<p ><span style='font-size: 1.35em;'>Other Names:</span></p><p class='details'> " + (pep.other_Names != "" ? pep.other_Names : "---") + "</p>"
					+ "<p ><span >Function:</span></p><p class='details'> " + pep.function + "</p>"
					+ "<p ><span >Category:</span></p><p class='details'> " + pep.category + "</p>"
					+ "<p ><span >Pob:</span></p><p class='details'> " + pep.pob + "</p>"
					+ "<p ><span >Country Of Activity:</span> <a href='#'>" + pep.country_Of_Activity + "</a></p>"
					+ "<div>"
					+"<div class='muster'>Muster</div>"
					+ "</article>";




				$("#inhalt").append(card);
				$(".scroll-wrap").append(artikel);

			

			});
		},
		error: function () {

		},
		complete: function () {		
	
			
		
			
		
			 $('[data-toggle="tooltip"]').tooltip();   
			
			$("#load").hide();
			$(".top-bar").fadeIn();
			$("#menu-toggle").fadeIn();

			$(".field-container").fadeIn();
				// $("#exportBtn").show();
			$("#formExakteSuche").show();
			count();
			

		
			
			
			 
			
			$.getScript("./js/main.js");
		}
	});
}




$(document).on("click",".getPdf__",function(evt){
	getPdf__(evt);
});


$("#nur_Pep").change(function(){
	
	$("#nur_Sankt").prop("checked" , false);
	$("#beides").prop("checked" , false);
	
	welcheListe = "nurPep";
	
	hierIstDieSuchFunktion();
	
});

$("#nur_Sankt").change(function(){
	
	$("#beides").prop("checked" , false);
	$("#nur_Pep").prop("checked" , false);
	
	welcheListe = "nurSanktion";
	
	
	hierIstDieSuchFunktion();
	
});

// $("#beides").change(function(){
//	
// $("#nur_Sankt").prop("checked" , false);
// $("#nur_Pep").prop("checked" , false);
//	
// welcheListe = "beideListen";
// });


function getUserAbfragen(){
	
	var labelArray= [];
	var datenArray = [];
	
	
	$.ajax({
		url: url + 'getAbfragen',
		type: 'GET',
		data: { _user: user,limit:_limit },
		beforeSend: function () {
			$(".spinner-grow").show();
		
		},
		success: function (data) {


			$.each(data, function (key, daten) {

				labelArray.push(daten.Am);
				datenArray.push(daten.Anzahl);
				
		
			});
		},
		error: function () {

		},
		complete: function () {



		
		}
	});
}



function charts(){
	
	
	
	var myLine = new Chart(myLine, {
	    type: 'line',
	    data: {
	        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	        datasets: [{
	            label: '# of Votes',
	            data: [12, 19, 3, 5, 2, 3],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	                'rgba(75, 192, 192, 0.2)',
	                'rgba(153, 102, 255, 0.2)',
	                'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255, 99, 132, 1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                }
	            }]
	        }
	    }
});
}


function imgError(image, ev) {

	if (image != '-' && image != "undefined") {
		var repl = image.slice(1, 2);
		var res = image.replace(repl, "").toLowerCase();



		if (res == 'ur') {
			res = 'ru';
		}
		else if (res == 'pl') {
			console.log("HALT!");
		}

		$(ev).attr('src', "/CPep_Spring/img/flaggen/" + res + ".png");
	}
	else {
		$(ev).attr('src', "/CPep_Spring/img/flaggen/no-image-available.png");
		$(ev).attr('width', "48px");
		$(ev).attr('height', "48px");
	}



}




function matchItem(string, data) {
    var i = 0,
        j = 0,
        html = '',
        regex,
        regexv,
        match,
        matches,
        version;
    
    for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, 'i');
        match = regex.test(string);
        if (match) {
            regexv = new RegExp(data[i].version + '[- /:;]([\d._]+)', 'i');
            matches = string.match(regexv);
            version = '';
            if (matches) { if (matches[1]) { matches = matches[1]; } }
            if (matches) {
                matches = matches.split(/[._]+/);
                for (j = 0; j < matches.length; j += 1) {
                    if (j === 0) {
                        version += matches[j] + '.';
                    } else {
                        version += matches[j];
                    }
                }
            } else {
                version = '0';
            }
            return {
                name: data[i].name,
                version: parseFloat(version)
            };
        }
    }
    return { name: 'unknown', version: 0 };
}
