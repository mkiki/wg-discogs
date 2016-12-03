# Discogs API to get music metadata

Utilities to retrieve cover and artist images from Discogs.

[Discogs API](https://www.discogs.com/developers/index.html)

## Installation

	npm link wg-log
	npm link wg-utils
	npm install


## Usage

	const Discogs = require('wg-discogs').Discogs;
	const utils = require('wg-utils');

Create the Discogs API proxy, passing it your Discogs key and secret

	var discogs = new Discogs(key, secret);
	
Search for releases

	return discogs.searchReleases("Benighted", "Psychose", function(err, releases) {
		...

Search for artists

	return discogs.searchArtists("Benighted", function(err, artists) {
		...

Get artist picture

	return discogs.searchArtists("Benighted", function(err, artists) {
	    var thumb = artists[0].thumb;
	    var ext = utils.getExtension(thumb);
	    var wstream = fs.createWriteStream('/tmp/artist.' + ext);
   		 return discogs.getAlbumArt(thumb, wstream, function(err) {
   		 	...
	      wstream.end();
	      
Get album covert image

	return discogs.searchReleases("Benighted", "Psychose", function(err, releases) {
		var thumb = releases[0].thumb;
		var ext = utils.getExtension(thumb);
		var wstream = fs.createWriteStream('/tmp/album.' + ext);
	    return discogs.getAlbumArt(thumb, wstream, function(err) {
	    	...
			wstream.end();


## Discogs Release

<table>
<tr>
	<td> style </td>
	<td> string[] </td>
	<td> A list of syles for this release. Ex: ["Black Metal", "Death Metal"], </td>
</tr>
<tr>
	<td> thumb </td>
	<td> string </td>
	<td> The URL to the thumbnail image. Ex: https://api-img.discogs.com/rYq-RDtA503SUrt-y40hUAoofFk=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-679234-1146818572.jpeg.jpg </td>
</tr>
<tr>
	<td> format </td>
	<td> string[] </td>
	<td> The release format. Ex: ["CD", "Album"] </td>
</tr>
<tr>
	<td> country </td>
	<td> string </td>
	<td> The release country. Ex: "France" </td>
</tr>
<tr>
	<td> barcode </td>
	<td> string[] </td>
	<td> Example: ["3700132600549", "DOCdata FRANCE CDAR054"] </td>
</tr>
<tr>
	<td> uri </td>
	<td> string </td>
	<td> The image orientation. 1=TopLeft, 2=TopRight, 3=BottomRight, 4=BottomLeft, 5=LeftTop, 6=RightTop, 7=RightBottom, 8=LeftBottom </td>
</tr>
<tr>
	<td> community </td>
	<td> Object </td>
	<td>  </td>
</tr>
<tr>
	<td> label </td>
	<td> string[] </td>
	<td> The release album label. Ex: ["Adipocere Records"] </td>
</tr>
<tr>
	<td> catno </td>
	<td> string </td>
	<td> </td>
</tr>
<tr>
	<td> year </td>
	<td> string </td>
	<td> The release year. Ex: "2002" </td>
</tr>
<tr>
	<td> genre </td>
	<td> string[] </td>
	<td> The release genre(s). Ex: ["Rock"] </td>
</tr>
<tr>
	<td> title </td>
	<td> string </td>
	<td> The release title. Ex: "Benighted - Psychose" </td>
</tr>
<tr>
	<td> resource_url </td>
	<td> string </td>
	<td> The release resource URL. Ex: "https://api.discogs.com/releases/679234" </td>
</tr>
<tr>
	<td> type </td>
	<td> string </td>
	<td> The release type. Ex: "release" </td>
</tr>
<tr>
	<td> id </td>
	<td> number </td>
	<td> The release Discogs identifier </td>
</tr>
</table>

## Discogs Artist

<table>
<tr>
<td> title </td>
<td> string[] </td>
<td> The artist name </td>
</tr>
<tr>
<td> thumb </td>
<td> string </td>
<td> The URL to the thumbnail image. Ex: https://api-img.discogs.com/rYq-RDtA503SUrt-y40hUAoofFk=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-679234-1146818572.jpeg.jpg </td>
</tr>
<tr>
<td> uri </td>
<td> string[] </td>
<td> </td>
</tr>
<tr> 
<td> resource_url </td>
<td> string </td>
<td> </td>
</tr>
<tr>
<td> id </td>
<td> number </td>
<td> The release Discogs identifier </td>
</tr>
</table>
