mapboxgl.accessToken = 'pk.eyJ1IjoicGphaW42ODAxIiwiYSI6ImNtbDA3cHZ4bDBhNXkzbHEyMjE5ODR1azUifQ.zkm5kg40QRzCBkbFqr6ZnA';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v11',
center: [-73.98, 40.74],
zoom: 11
});

function openModal(videos) {
  const modal = document.getElementById('videoModal');

  modal.style.display = 'flex';

  currentVideos = videos;
  currentIndex = 0;

  renderVideo();
}

/* =========================
   RESTAURANT DATA
========================= */

const restaurantData = {
"type": "FeatureCollection",
"features": [

{
"type": "Feature",
"properties": {
"title": "Duzan Mediterranean Grill",
"views": 63921,
"category": "Middle Eastern",
"location": "124-11 Steinway St, Long Island City, NY 11103",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@devourpower/video/7231158637127847214",
"author": "devourpower",
"likes": 17300
},
{
"url": "https://www.tiktok.com/@duzannyc/video/7149237304664542507",
"author": "duzannyc",
"likes": 25400
},
{
"url": "https://www.tiktok.com/@naw_sir/video/7261782354354801966",
"author": "naw_sir",
"likes": 1123
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.906470, 40.77196] }
},

{
"type": "Feature",
"properties": {
"title": "Felice 64",
"views": 47576,
"category": "Italian",
"location": "1166 1st Ave, New York, NY 10065",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@alan_chengg/video/7543817135512980791",
"author": "alan_chengg",
"likes": 21
},
{
"url": "https://www.tiktok.com/@elda_sinani/video/7029139939883535662",
"author": "elda_sinani",
"likes": 9
},
{
"url": "https://www.tiktok.com/@maria.guadagno/video/7108774530180746542",
"author": "maria.guadagno",
"likes": 9
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.959564, 40.762567] }
},

{
"type": "Feature",
"properties": {
"title": "Sybil’s Bakery and Restaurant",
"views": 465561,
"category": "Caribbean",
"location": "159-24 Hillside Ave., Jamaica, NY 11432",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@hungryartistny/video/7445068164905340191",
"author": "hungryartistny",
"likes": 33300
},
{
"url": "https://www.tiktok.com/@kaylee_dharry/video/7086999903053991214",
"author": "kaylee_dharry",
"likes": 599
},
{
"url": "https://www.tiktok.com/@shopwips/video/7358154797695946026",
"author": "shopwips",
"likes": 28
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.801868, 40.707792] }
},

{
"type": "Feature",
"properties": {
"title": "El Malecon",
"views": 160244,
"category": "Caribbean",
"location": "4141 Broadway, New York, NY 10033",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@priyas_plates/video/7591213033544764685?q=malecon%20restaurant%20nyc&t=17771360392841",
"author": "priyas_plates",
"likes": 53
},
{
"url": "https://www.tiktok.com/@good.bytes/video/7596849465600773406?q=malecon%20restaurant%20nyc&t=1777136039284",
"author": "good.bytes",
"likes": 57000
},
{
"url": "https://www.tiktok.com/@food.and.footprints/video/7563406932640353549?q=malecon%20restaurant%20nyc&t=1777136039284",
"author": "food.and.footprints",
"likes": 1621
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.938620, 40.846401] }
},

{
"type": "Feature",
"properties": {
"title": "Ariemma’s Italian Deli",
"views": 137464,
"category": "Delicatessen",
"location": "1791 Hylan BlvdStaten Island, NY 10305",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@meals_by_cug/video/7080561315336621358",
"author": "meals_by_cug",
"likes": 52400
},
{
"url": "https://www.tiktok.com/@secretsofpowerfulwomen/video/7331505396227525934",
"author": "secretsofpowerfulwomen",
"likes": 26
},
{
"url": "https://www.tiktok.com/@ariemmmasgardencenter/video/7585588559231356190",
"author": "ariemmmasgardencenter",
"likes": 144
}
])
},
"geometry": { "type": "Point", "coordinates": [-74.093421, 40.585503] }
},

{
"type": "Feature",
"properties": {
"title": "Dos Toros Taqueria - Union Square",
"views": 7804,
"category": "Mexican",
"location": "137 4th Ave, New York, NY 10003",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@eatsbynyc/video/7324830008042589482",
"author": "eatsbynyc",
"likes": 253
},
{
"url": "https://www.tiktok.com/@theerichammer/video/7322145241845239082",
"author": "theerichammer",
"likes": 1701
},
{
"url": "https://www.tiktok.com/@christinetao/video/7623946036263914766",
"author": "christinetao",
"likes": 751
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9896812, 40.7335742] }
},

{
"type": "Feature",
"properties": {
"title": "Superiority Burger",
"views": 174648,
"category": "Burgers",
"location": "119 Avenue A, New York, NY 10009",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@beli_eats/video/7360853188079308078",
"author": "beli_eats",
"likes": 2337
},
{
"url": "https://www.tiktok.com/@thecarboholic/video/7357114467336981802",
"author": "thecarboholic",
"likes": 1451
},
{
"url": "https://www.tiktok.com/@inkind.app/video/7607975534554795277",
"author": "inkind.app",
"likes": 34
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.983509 , 40.726484] }
},

{
"type": "Feature",
"properties": {
"title": "Phayul",
"views": 56233,
"category": "Indian",
"location": "37-65 74th St., Jackson Heights, NY 11372",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@consumingcouple/video/7081414015112514822",
"author": "consumingcouple",
"likes": 7086
},
{
"url": "https://www.tiktok.com/@thebingbuzz/video/7435445281472269611",
"author": "thebingbuzz",
"likes": 372
},
{
"url": "https://www.tiktok.com/@briancantstopeating/video/7233430116053962026",
"author": "briancantstopeating",
"likes": 17000
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.891349 , 40.7471617] }
},

{
"type": "Feature",
"properties": {
"title": "Full Moon Pizzeria",
"views": 1351,
"category": "Italian",
"location": "600 E 187th St, Bronx, NY 10458",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@melogotjays/video/7353447347172478250",
"author": "melogotjays",
"likes": 16
},
{
"url": "https://www.tiktok.com/@mr.positivesarmy/video/7364337389583469867",
"author": "mr.positivesarmy",
"likes": 14
},
{
"url": "https://www.tiktok.com/@enjoylifewithmichaela/video/7429898773477739819",
"author": "enjoylifewithmichaela",
"likes": 11
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.887591 , 40.855303] }
},

{
"type": "Feature",
"properties": {
"title": "Pommes Frites",
"views": 173154,
"category": "Belgian",
"location": "128 MacDougal St, New York, NY 10012",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@beyond.the.square/video/7535862883024997646",
"author": "beyond.the.square",
"likes": 1628
},
{
"url": "https://www.tiktok.com/@cindyeatsnyc/video/7309072538628328747",
"author": "cindyeatsnyc",
"likes": 36900
},
{
"url": "https://www.tiktok.com/@reluctantbites/video/7559513210294947102",
"author": "reluctantbites",
"likes": 10100
}
])
},
"geometry": { "type": "Point", "coordinates": [-74.0002813 , 40.7301222] }
},

{
"type": "Feature",
"properties": {
"title": "Maharaja Sweets and Snacks",
"views": 4717,
"category": "Indian",
"location": "73-10 37th Ave, Jackson Heights, NY 11372",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@sethimaan0/video/7492900424693959982",
"author": "sethimaan0",
"likes": 490
},
{
"url": "https://www.tiktok.com/@kasey.diary/video/7541076081206414647",
"author": "kasey.diary",
"likes": 1426
},
{
"url": "https://www.tiktok.com/@budsonthemove/video/7231760267066051882",
"author": "budsonthemove",
"likes": 418
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.8923836 , 40.7487772] }
},

{
"type": "Feature",
"properties": {
"title": "Zuma",
"views": 6212,
"category": "Japanese/Sushi",
"location": "261 Madison Ave, New York, NY 10016",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@animayana_/video/7295494282549546282",
"author": "animayana_",
"likes": 1455
},
{
"url": "https://www.tiktok.com/@tova_haimov/video/7561998002961796407",
"author": "tova_haimov",
"likes": 29
},
{
"url": "https://www.tiktok.com/@newyorkbyjenny/video/7425978345977924906",
"author": "newyorkbyjenny",
"likes": 602
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9807367 , 40.7504423] }
},

{
"type": "Feature",
"properties": {
"title": "Yonah Schimmel Knish Bakery",
"views": 65770,
"category": "Eastern European",
"location": "137 E Houston St, New York, NY 10002",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@hereinnyc/video/7210492073643101486",
"author": "hereinnyc",
"likes": 12100
},
{
"url": "https://www.tiktok.com/@stoolpresidente/video/7249861588457475370",
"author": "stoolpresidente",
"likes": 10700
},
{
"url": "https://www.tiktok.com/@nyjewishweek/video/7281395114021342495",
"author": "nyjewishweek",
"likes": 23300
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.989809 , 40.722336] }
},

{
"type": "Feature",
"properties": {
"title": "Arepa Lady",
"views": 17156,
"category": "Colombian",
"location": "77-17 37th Ave, Jackson Heights, NY 11372",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@good.bytes/video/7336594457694850346",
"author": "good.bytes",
"likes": 1423
},
{
"url": "https://www.tiktok.com/@snackpass/video/7331132950383234346",
"author": "snackpass",
"likes": 725
},
{
"url": "https://www.tiktok.com/@comiendoenla/video/7506370543516388650",
"author": "comiendoenla",
"likes": 1122
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.8882711 , 40.7494972] }
},

{
"type": "Feature",
"properties": {
"title": "Mama’s Too",
"views": 1985067,
"category": "Italian",
"location": "2750 Broadway, New York, NY 10025",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@jacksdiningroom/video/7369992676709682478",
"author": "jacksdiningroom",
"likes": 514400
},
{
"url": "https://www.tiktok.com/@briancantstopeating/video/7414160028606762286",
"author": "briancantstopeating",
"likes": 29300
},
{
"url": "https://www.tiktok.com/@imma_eat_this/video/7494311832497311018",
"author": "imma_eat_this",
"likes": 4788
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.967590 , 40.800832] }
},

{
"type": "Feature",
"properties": {
"title": "Lhasa Fast Food",
"views": 701413,
"category": "Chinese",
"location": "76-03 37th Ave, Jackson Heights, NY 11372",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@hungryartistny/video/7206444991915461934",
"author": "hungryartistny",
"likes": 206
},
{
"url": "https://www.tiktok.com/@eatingwithrobert/video/7485864087084109086",
"author": "eatingwithrobert",
"likes": 23900
},
{
"url": "https://www.tiktok.com/@thewildamalia/video/7371213644639538449",
"author": "thewildamalia",
"likes": 816
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.889748 , 40.749354] }
},

{
"type": "Feature",
"properties": {
"title": "Atomic Wings",
"views": 367305,
"category": "American (Traditional)",
"location": "Smorgasburg 90 Kent Ave, Brooklyn, NY, 11211",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@solissecrets/video/7562976876096916767",
"author": "solissecrets",
"likes": 357
},
{
"url": "https://www.tiktok.com/@eliteeatswithp/video/7590125551122156814",
"author": "eliteeatswithp",
"likes": 563
},
{
"url": "https://www.tiktok.com/@cookiesncreameats/video/7233898253564022059",
"author": "cookiesncreameats",
"likes": 145
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9625824 , 40.7210981] }
},

{
"type": "Feature",
"properties": {
"title": "Papaya Dog",
"views": 121479,
"category": "American (Traditional)",
"location": "109 Eldridge StNew York, NY 10002",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@aboricualifeinusa/video/7443998288019344683",
"author": "aboricualifeinusa",
"likes": 15
},
{
"url": "https://www.tiktok.com/@robbie.rates/video/7618995180250631455",
"author": "robbie.rates",
"likes": 1897
},
{
"url": "https://www.tiktok.com/@foodtok368/video/7535856673546571021",
"author": "foodtok368",
"likes": 37100
}
])
},
"geometry": { "type": "Point", "coordinates": [ -73.9922251 , 40.7182218] }
},

{
"type": "Feature",
"properties": {
"title": "Errol’s Caribbean Delights",
"views": 67103,
"category": "Caribbean",
"location": "661 Flatbush AveBrooklyn, NY 11225",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@itsyaboymikeofficial/video/7014980678605344005",
"author": "itsyaboymikeofficial",
"likes": 3070
},
{
"url": "https://www.tiktok.com/@domikoreana/video/7579819880837385502",
"author": "domikoreana",
"likes": 11
},
{
"url": "https://www.tiktok.com/@aprilheree_/video/7565269039199636766",
"author": "aprilheree_",
"likes": 4392
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9599946 , 40.6571284] }
},

{
"type": "Feature",
"properties": {
"title": "Schnipper’s Times Square",
"views": 13045,
"category": "American (Traditional)",
"location": "620 8th Ave, New York, NY 10018",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@nycmuncher/video/7426769235117886763",
"author": "nycmuncher",
"likes": 47
},
{
"url": "https://www.tiktok.com/@eat_this_1/video/7462138553795972382",
"author": "eat_this_1",
"likes": 1203
},
{
"url": "https://www.tiktok.com/@joshuamichaell/video/7623083323690208525",
"author": "joshuamichaell",
"likes": 48
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9903370 , 40.7562689] }
},

{
"type": "Feature",
"properties": {
"title": "Mah-Ze-Dahr Bakery",
"views": 59920,
"category": "American (Traditional)",
"location": "28 Greenwich Ave, New York, NY 10011",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@pritokayed/video/7503001700802792735",
"author": "pritokayed",
"likes": 1750
},
{
"url": "https://www.tiktok.com/@kamiecrawford/video/7500352962267548959",
"author": "kamiecrawford",
"likes": 1546
},
{
"url": "https://www.tiktok.com/@diaryofamaterialgurl/video/7444167177944534303",
"author": "diaryofamaterialgurl",
"likes": 4615
}
])
},
"geometry": { "type": "Point", "coordinates": [-74.0000164 , 40.7350283] }
},

{
"type": "Feature",
"properties": {
"title": "Thelewala",
"views": 19933,
"category": "Indian",
"location": "112 MacDougal St, New York, NY 10012",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@vatscookin/video/7519300142730595614",
"author": "vatscookin",
"likes": 461
},
{
"url": "https://www.tiktok.com/@nycbuddhaeats/video/7223248905897676078",
"author": "nycbuddhaeats",
"likes": 66
},
{
"url": "https://www.tiktok.com/@aman.archive/video/7342887293276998918",
"author": "aman.archive",
"likes": 78
}
])
},
"geometry": { "type": "Point", "coordinates": [-74.0006936 , 40.7296527] }
},

{
"type": "Feature",
"properties": {
"title": "Naruto Ramen",
"views": 347223,
"category": "Japanese/Sushi",
"location": "1596 3rd Ave, New York, NY 10128",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@kenzmyers/video/7611621294920060191",
"author": "kenzmyers",
"likes": 96
},
{
"url": "https://www.tiktok.com/@unwordlylike/video/7602651977935342861",
"author": "unwordlylike",
"likes": 14600
},
{
"url": "https://www.tiktok.com/@brinks8939/video/7566480740830006583",
"author": "brinks8939",
"likes": 7582
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9524897 , 40.7811956] }
},

{
"type": "Feature",
"properties": {
"title": "Pho Grand",
"views": 875267,
"category": "Vietnamese",
"location": "277C Grand St, New York, NY 10002",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@banhmi4.u/video/7555512028576681230",
"author": "banhmi4.u",
"likes": 702
},
{
"url": "https://www.tiktok.com/@mablemeetsworld/video/7579393668562308407",
"author": "mablemeetsworld",
"likes": 2765
},
{
"url": "https://www.tiktok.com/@grwm_a1ish1a22/video/7613444821553925407",
"author": "grwm_a1ish1a22",
"likes": 6
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9927822 , 40.7176857] }
},

{
"type": "Feature",
"properties": {
"title": "The Commodore",
"views": 49082,
"category": "Southern",
"location": "366 Metropolitan Ave, Brooklyn, NY 11211",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@briancantstopeating/video/7225787135310368046",
"author": "briancantstopeating",
"likes": 2537
},
{
"url": "https://www.tiktok.com/@jonathanchoione/video/7124776334093569323",
"author": "jonathanchoione",
"likes": 70
},
{
"url": "https://www.tiktok.com/@livefastdineyoung/video/7239709565376384299",
"author": "livefastdineyoung",
"likes": 120
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9558939 , 40.7139049] }
},

{
"type": "Feature",
"properties": {
"title": "Cheese Grille",
"views": 83394,
"category": "American (Traditional)",
"location": "188 Allen St, NYC",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@cheesegrille/video/7192657732472786219",
"author": "cheesegrille",
"caption": "Celebrities visited 👀",
"likes": 105
}
])
},
"geometry": { "type": "Point", "coordinates": [ -73.9885928, 40.7219476] }
},

{
"type": "Feature",
"properties": {
"title": "Naya - Midtown East Third Avenue",
"views": 3062,
"category": "Middle Eastern",
"location": "6th Ave & W 53rd StNew York, NY 10019",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@locdin2dathrift/video/7622004680419314957",
"author": "locdin2dathrift",
"likes": 19
},
{
"url": "https://www.tiktok.com/@sexiiiting/video/7586781162358525197",
"author": "sexiiiting",
"likes": 126
},
{
"url": "https://www.tiktok.com/@vedaaaaa7/video/7506596824673701150",
"author": "vedaaaaa7",
"likes": 80
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.978770 , 40.761980] }
},

{
"type": "Feature",
"properties": {
"title": "Tacombi @ Fonda Nolita",
"views": 91847,
"category": "Mexican",
"location": "42-08 30th Ave.Astoria, NY 11103",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@casserolebites/video/7426357155613183278",
"author": "casserolebites",
"likes": 25400
},
{
"url": "https://www.tiktok.com/@traveleen_gurl/video/7603226253394464030",
"author": "traveleen_gurl",
"likes": 42
},
{
"url": "https://www.tiktok.com/@niafromnyc/video/7449061962832481582",
"author": "niafromnyc",
"likes": 1226
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9131534 , 40.7628952] }
},

{
"type": "Feature",
"properties": {
"title": "Golda",
"views": 4432,
"category": "American (Traditional)",
"location": "504 Franklin Ave, Brooklyn, NY, United States, 11238",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@lysswthelenz/video/7543445493167312183",
"author": "lysswthelenz",
"likes": 1240
},
{
"url": "https://www.tiktok.com/@lysswthelenz/video/7543419917803080974",
"author": "lysswthelenz",
"likes": 450
},
{
"url": "https://www.tiktok.com/@_justemela_/video/6936565637514939653",
"author": "_justemela_",
"likes": 890
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.9559828 , 40.6815381] }
},

{
"type": "Feature",
"properties": {
"title": "RedFarm - West Village",
"views": 12241,
"category": "Chinese",
"location": "529 Hudson St, Manhattan, NY, 10014",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@sisterhoodtravelingfork/video/7606002737959996685",
"author": "sisterhoodtravelingfork",
"likes": 2105
},
{
"url": "https://www.tiktok.com/@myjobiscity/video/7501698883362376991",
"author": "myjobiscity",
"likes": 842
},
{
"url": "https://www.tiktok.com/@caseyshappyhealthy/video/7499137172885359903",
"author": "caseyshappyhealthy",
"likes": 430
}
])
},
"geometry": { "type": "Point", "coordinates": [-74.006003 , 40.733979] }
},

{
"type": "Feature",
"properties": {
"title": "KazuNori",
"views": 2168093,
"category": "Japanese/Sushi",
"location": "15 W 28th St, New York, NY 10001",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@dulasdiningdiaries/video/7587187733676772639",
"author": "dulasdiningdiaries",
"likes": 1997
},
{
"url": "https://www.tiktok.com/@momentswithmt/video/7314214080435326251",
"author": "momentswithmt",
"likes": 835
},
{
"url": "https://www.tiktok.com/@simplytastybites/video/7355494868107431210",
"author": "simplytastybites",
"likes": 573
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.988383 , 40.74515] }
},

{
"type": "Feature",
"properties": {
"title": "Peaches HotHouse",
"views": 33634,
"category": "Southern",
"location": "415 Tompkins Ave, Brooklyn, NY, 11216",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@mostasting/video/7521176492751981855",
"author": "mostasting",
"likes": 51900
},
{
"url": "https://www.tiktok.com/@nyccheatdayking/video/7157126545046408494",
"author": "nyccheatdayking",
"likes": 1177
},
{
"url": "https://www.tiktok.com/@itsjulianmu/video/7466974511422901534",
"author": "itsjulianmu",
"likes": 235200
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.94406 , 40.68331] }
},

{
"type": "Feature",
"properties": {
"title": "Wattle Cafe",
"views": 1260,
"category": "Australian",
"location": "19 Rector St, New York, NY, 10006",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@j.oann4/video/7097613144326950145",
"author": "j.oann4",
"likes": 59
},
{
"url": "https://www.tiktok.com/@wattlecafe/video/7293937438920166687",
"author": "wattlecafe",
"likes": 280
},
{
"url": "https://www.tiktok.com/@averagesocialite/video/6941532482822999302",
"author": "averagesocialite",
"likes": 595
}
])
},
"geometry": { "type": "Point", "coordinates": [-74.014142 , 40.708149] }
},

{
"type": "Feature",
"properties": {
"title": "Mangia Madison",
"views": 9669,
"category": "Italian",
"location": "422 Madison Ave, New York, NY, 10017",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@fooodforfooodies/video/7572718340334996767",
"author": "fooodforfooodies",
"likes": 1280
},
{
"url": "https://www.tiktok.com/@mangia_nyc/video/7584929681699360055",
"author": "mangia_nyc",
"likes": 642
},
{
"url": "https://www.tiktok.com/@kwokdontrun/video/7609128150068399390",
"author": "kwokdontrun",
"likes": 420
}
])
},
"geometry": { "type": "Point", "coordinates": [ -73.977227 , 40.756771] }
},

{
"type": "Feature",
"properties": {
"title": "Spicy Moon - East Village",
"views": 10509,
"category": "Vegan",
"location": "328 E 6th StNew York, NY 10003",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@bodegacatx/video/7206052250475842862",
"author": "bodegacatx",
"likes": 587
},
{
"url": "https://www.tiktok.com/@vegnews/video/7603803828583976222",
"author": "vegnews",
"likes": 142
},
{
"url": "https://www.tiktok.com/@whitwhitberry/video/7585459003375881486",
"author": "whitwhitberry",
"likes": 420
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.988133 , 40.727031] }
},


{
"type": "Feature",
"properties": {
"title": "Calexico",
"views": 1000,
"category": "Mexican",
"location": "Greenpoint, Brooklyn",
"videos": JSON.stringify([
{
"url": "https://www.tiktok.com/@seewithme_x/video/7627344861070396685",
"author": "seewithme_x",
"caption": "Best tacos 🌮",
"likes": 19
}
])
},
"geometry": { "type": "Point", "coordinates": [-73.95, 40.73] }
}

]
};

/* =========================
   MAP LOAD
========================= */
map.on('load', async () => {
    // 1. Fetch from Supabase
    const { data: restaurants, error } = await _supabase
        .from('restaurants')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    // 2. Convert database rows to GeoJSON
    const geojson = {
        type: 'FeatureCollection',
        features: restaurants.map(r => ({
            type: 'Feature',
            properties: {
                title: r.name,
                views: r.views, 
                category: r.cuisine, // Ensure this column is named 'cuisine' in Supabase
                location: r.address,
                videos: JSON.stringify([
                    { url: r.video_url_1 },
                    { url: r.video_url_2 },
                    { url: r.video_url_3 }
                ].filter(v => v.url)) 
            },
            geometry: {
                type: 'Point',
                coordinates: [r.longitude, r.latitude]
            }
        }))
    };

    // 3. Add source
    map.addSource('restaurants', {
        type: 'geojson',
        data: geojson
    });

    // 4. Add layer (Updated to lowercase to match your new data)
    map.addLayer({
        id: 'restaurant-points',
        type: 'circle',
        source: 'restaurants',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'views'],
                1000, 8,
                2000000, 60
            ],
            'circle-color': [
                'match',
                ['get', 'category'],
                'middle eastern', '#e63946',
                'indian', '#0b00a8',
                'mexican', '#2a9d8f',
                'italian', '#5d6eeb',
                'caribbean', '#b83be9',
                'delicatessen', '#9fe2c9',
                'burgers', '#8b4801',
                'belgian', '#c8aeff',
                'japanese/sushi', '#fffd6b',
                'eastern european', '#ff5fdc',
                'colombian', '#7b1616',
                'chinese', '#bfff00',
                'american (traditional)', '#ff7700',
                'vietnamese', '#650cd9',
                'southern', '#1ac030',
                'australian', '#02c9d0',
                '#888'
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
        }
    });
});

  /* =========================
     POPUP
  ========================= */
  map.on('click', 'restaurant-points', (e) => {

    const props = e.features[0].properties;
    const coords = e.features[0].geometry.coordinates.slice();

    const videos = JSON.parse(props.videos);
    const firstVideo = videos[0];
    const videoID = getTikTokID(firstVideo.url);

    const popupNode = document.createElement('div');

    popupNode.innerHTML = `
      <div>
        <div class="popup-title">${props.title}</div>
        <div class="popup-location">${props.location}</div>

        <iframe 
          src="https://www.tiktok.com/embed/${videoID}"
          width="100%" 
          height="220"
          frameborder="0"
          allowfullscreen>
        </iframe>

        <button class="more-btn">More Videos →</button>
      </div>
    `;

    /* 🔥 THIS is the correct event binding */
    popupNode.querySelector('.more-btn').onclick = () => {
      openModal(videos);
    };

    new mapboxgl.Popup()
      .setLngLat(coords)
      .setDOMContent(popupNode)
      .addTo(map);
  });

});

/* =========================
   MODAL + ONE VIDEO AT A TIME
========================= */

let currentIndex = 0;
let currentVideos = [];

function getTikTokID(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

function openModal(videos) {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.querySelector('.close');
  const hint = document.getElementById('swipeHint');

  modal.style.display = 'flex';
  closeBtn.style.display = 'block';

  currentVideos = videos;
  currentIndex = 0;

  renderVideo();

  hint.style.display = 'block';

  setTimeout(() => {
    hint.style.display = 'none';
  }, 8000);
}

function renderVideo() {
  const carousel = document.getElementById('carousel');
  const video = currentVideos[currentIndex];
  const videoID = getTikTokID(video.url);

  if (!videoID) return;

  carousel.innerHTML = `
    <div class="carousel-video">
      <iframe 
        src="https://www.tiktok.com/embed/${videoID}"
        width="100%" 
        height="500"
        frameborder="0"
        allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        allowfullscreen>
      </iframe>

      <div>@${video.author} ❤️ ${video.likes}</div>

      <a href="${video.url}" target="_blank" class="open-tiktok">
        Watch on TikTok →
      </a>

      <div class="nav-buttons">
        <button onclick="prevVideo()">←</button>
        <span>${currentIndex + 1} / ${currentVideos.length}</span>
        <button onclick="nextVideo()">→</button>
      </div>
    </div>
  `;
}

function nextVideo() {
  if (currentIndex < currentVideos.length - 1) {
    currentIndex++;
    renderVideo();
  }
}

function prevVideo() {
  if (currentIndex > 0) {
    currentIndex--;
    renderVideo();
  }
}

function closeModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.querySelector('.close');

  modal.style.display = 'none';
  closeBtn.style.display = 'none';
}

window.onclick = function(e) {
  const modal = document.getElementById('videoModal');
  if (e.target === modal) {
    closeModal();
  }
};

/* =========================
   FILTER UI ONLY
========================= */
function setFilter(category, btn) {

  if (category === 'all') {
    map.setFilter('restaurant-points', null);
  } else {
    map.setFilter('restaurant-points', ['==', ['get', 'category'], category]);
  }

  // UI highlight
  document.querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));

  btn.classList.add('active');
}