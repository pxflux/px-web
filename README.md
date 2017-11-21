# pxflux [![Build Status](https://travis-ci.org/pxflux/px-dashboard-web.svg?branch=master)](https://travis-ci.org/pxflux/px-dashboard-web)

> Platform for the exhibition, distribution and collection of time based, computational art

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
# Data Types:
[**Account**](#account)  

[**Artwork**](#artwork)  
* [_ArtworkBase_](#artworkbase)  
* [_Artwork_](#artworkmain)  
* [_**Iteration**_](#iteration)  

[**Collection**](#collection)

[**Show**](#show)
* [_ShowBase_](#showbase)  
* [_Show_](#showmain)  

[**Publication**](#publication)  
*  [_PublicationBase_](#publicationbase)  
*  [_Publication_](#publicationmain)  

[**Place**](#place)  
*  [_PlaceBase_](#placebase)  
*  [_Place_](#placemain)  

[**User/Person**](#userperson)
*  [_User_](#user)
*  [_ArtistBase_](#artistbase)
*  [_Artist_](#artist)
*  [_Contributor_](#contributor)

[**"Primitive" Types**](#primitive)
*  [_Attachment_](#attachment)
*  [_Control_](#control)
*  [_Record_](#record)

[**Iteration Specific**](#iterationspecific)
*  [_Note_](#note)
*  [_IterationComponent_](#iterationcomponent)
*  [_Equipment_](#equipment)
*  [_DisplayEquipment_](#displayequipment)
*  [_AudioEquipment_](#audioequipment)
*  [_PlaybackEquipment_](#playbackequipment)  

<a name="account"/>
<a name="artwork"/>
<a name="artworkbase"/>
<a name="artworkmain"/>
<a name="iteration"/>
<a name="collection"/>
<a name="show"/>
<a name="showbase"/>
<a name="showmain"/>
<a name="publication"/>
<a name="publicationbase"/>
<a name="publicationmain"/>
<a name="place"/>
<a name="placebase"/>
<a name="placemain"/>
<a name="userperson"/>
<a name="user"/>
<a name="artistbase"/>
<a name="artist"/>
<a name="contributor"/>
<a name="primitive"/>
<a name="attachment"/>
<a name="control"/>
<a name="record"/>
<a name="iterationspecific"/>
<a name="note"/>
<a name="iterationcomponent"/>
<a name="equipment"/>
<a name="displayequipment"/>
<a name="audioequipment"/>
<a name="playbackequipment"/>

#

## Account
```javascript
title: String
organisationType: String /* One of predefined options */ 
organisationPlace: Place
description: String /* Multi-line, with allowed html tags */
contributors: Contributor[]
artworks: ArtworkBase[]
collections: Collection[]
artists: ArtistBase[]
shows: ShowBase[]
publications: PublicationBase[]
places: PlaceBase[]
```

## Artwork

#### ArtworkBase:
```javascript
id: String
accountId: String
published: boolean
title: String /* required, default: 'Untitled' */
thumbnail: Attachment
preview:{
    type: String /* 'video'|'gif'|'slideshow' */
    url: String
}
year: String
credits: Contributor[]
category: String[]
tags: String[]
```
#### Artwork:
```javascript
/**
 * inherited from ArtworkBase
 * 
 accountId: String
 published: boolean
 title: String - *required, default: 'Untitled'
 thumbnail: Attachment
 preview:{
     type: 'video'|'gif'|'slideshow'
     url: String
 }
 year: String
 credits: Contributor[]
*/
description: String /* Multi-line, allowed html tags: <a> <p> <b> <i> <h> */
source: {
    type: 'video'|'html'
    url: String
}
controls: Control[]
iterations: Iteration[]
shows: ShowBase[]
```
       
## Iteration:
**Iterations are properties of an Artwork.**  
Based on Iteration Report by Guggenheim Conservation Department:  
https://www.guggenheim.org/wp-content/uploads/2015/11/guggenheim-conservation-iteration-report-2012.pdf
 
```javascript
id: String
name: String
thumbnail: Attachment
date: Date,
exhibitions: ShowBase[]
contributors: Contributor[]
supervisedBy: Contributor
installation: {
  installedBy: Contributor[]
  withArtist: boolean,
  artistInfluence: Note
}
documentation: {
  images: Attachment[]
  video: Attachment[]
  technicalDrawings: Attachment[]
  notes: Note[]
  artistInterview: Note
  assistantInterview: Note
  other: Attachment[]
},
evaluation: {
  notes: Note[]
  approvedByArtist: boolean
  warnings: Note[]
}
comments: Record[]
publications: Publication[]
space: {
  context: IterationComponent
  floorPlan: IterationComponent
  dimensions: IterationComponent
  fakeWalls: IterationComponent
  ceilingHeight: IterationComponent
  ceiling: IterationComponent
  wall: IterationComponent
  floor: IterationComponent
  acoustic: IterationComponent
  lighting: IterationComponent
  entranceExit: IterationComponent
  visitorFlow: IterationComponent
  displayPosition: IterationComponent
  playerPosition: IterationComponent
  projectionDistances: IterationComponent
  screens: IterationComponent
  imageSize: IterationComponent
  imagePlacement: IterationComponent
  projectionSurface: IterationComponent
}
exhibitionCopies: { 
  /* we probably don't need this.. 
  Or maybe this is the place to store alterations to the Artwork.source. 
  Like other url, Number of screens etc. */ 
}
equipment: {
  visual: DisplayEquipment
  audio: AudioEquipment
  playback: PlaybackEquipment
  other: IterationComponent[]
}
otherComponents: field('IterationComponentList')
technicalSetup: {
  looped: IterationComponent
  timed: IterationComponent
  synched: IterationComponent
  controlled: IterationComponent
  amperageInSpaceAtEquipment: IterationComponent
  conditionedPower: IterationComponent
  cabling: IterationComponent
  settings: IterationComponent
  other: IterationComponent
}
```

## Collection
**Collections are properties of an Account.**  
```javascript
accountId: String
name: String
artworks: ArtworkBase[]
contributors: Contributor[]
description: String /* Multi-line with allowed html tags */
category: String[]
tags: String[]
```

## Show
#### ShowBase:
```javascript
id: String
title: String
date: {
    start: Date
    end: Date
}
thumbnail: Attachment
url: String
place: Place
category: String[]
tags: String[]
```
#### Show:
```javascript
/**
 * inherited from ShowBase
 *
 id: String
 title: String
 date: {
     start: Date
     end: Date
 }
 thumbnail: Attachment
 url: String
 place: Place
*/
artists: ArtistBase[]
curators: Contributor[]
artworks: ArtworkBase[]
synopsis: String
description: String - /* allowed html tags: <a><p><b><i><h1><h2><h3> */
publications: PublicationBase[]
attachments: Attachment[]
```
## Publication
#### PublicationBase:
```javascript

```
#### Publication:
```javascript

```
## Place  
#### PlaceBase:
```javascript
name: String
type: String /* one of predefined options e.g. 'museum'|'gallery'|etc. */
url: String
shows: ShowBase[]
artists: Artist[]
address: {
  streetHouse: String
  zip: String
  city: String
  province: String 
  country: String 
}
category: String[]
tags: String[]
```

#### Place:
```javascript
/**
 * inherited from PlaceBase
 * 
 name: String
 type: String /* one of predefined options e.g. 'museum'|'gallery'|etc. * /
 url: String
 shows: ShowBase[]
 artists: Artist[]
 address: {
   streetHouse: String
   zip: String
   city: String
   province: String 
   country: String 
 }
*/
contact:{
  email: String  
  phone: String
}
description: String /* Multi-line with allowed html tags */
publications: PublicationBase[]
attachments: Attachment[]
```

## User/Person
#### User:
```javascript
userId: String
fullName: String
image: Attachment
```
#### ArtistBase:
```javascript
/**
 * inherited from User
 * 
 userId: String
 fullName: String
 image: Attachment 
 */
artworks: ArtworkBase[]
shows: ShowBase[]
```
#### Artist:
```javascript
/**
 * inherited from ArtistBase
 * 
 userId: String
 fullName: String
 image: Attachment 
 artworks: ArtworkBase[]
 shows: ShowBase[]
 */
publications: PublicationBase[]
inCollections: CollectionBase[]
cv: String - formated text
description: String /* Multi-line with allowed html tags */
category: String[]
tags: String[]
```

#### Contributor:
```javascript
/**
 * inherited from User
 * 
 userId: String
 fullName: String
 image: Attachment 
 */
role: String - One of the predifined options.
```
_The role options depend on the context where Contributor type is used (inside Artwork, Iteration, Account etc.)_

## "Primitive" Types
#### Attachment:
```javascript
displayUrl: String
storageUri: String
mimeType: String
```

#### Control:
```javascript
order: Number
icon: String|Attachment
label: String
type: String - 'keyboard'|'mouse'|'function'|'custom'
value: {
  keyCode: String 
  modifier: String - 'shiftKey'|'ctrlKey'|'altKey'|'metaKey'
  type: String - 'keydown'|'keyup'|'keypress'
}
```
_It's a draft yet_

#### Record:
```javascript
created: Date
modified: Date
author: Contributor
text : String
attachments : {
  displayUrl: String
  storageUri: String
}[]
```

## Iteration Specific
#### Note:
```javascript
/**
 * inherited from Comment
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : {
    displayUrl: String
    storageUri: String
  }[]
*/
onBehalfOf: Contributor
```

#### IterationComponent:
```javascript
/**
 * inherited from Note
 * 
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : {
    displayUrl: String
    storageUri: String
  }[]
*/
type: String - one of predifined options
reason: String
decidedBy: Contributor
necessity: String - One of 'possible'|'recommended'|'important'|'critical'
```
#### Equipment:
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : {
    displayUrl: String
    storageUri: String
  }[]
  type: String - one of predifined options
  reason: String
  decidedBy: Contributor
  necessity: String - One of 'possible'|'recommended'|'important'|'critical'
*/
dimensions: [Number, Number, Number]
appearance: String - text
weight: Number
```
#### DisplayEquipment

_Taken partly from http://www.projectorcentral.com_
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : {
    displayUrl: String
    storageUri: String
  }[]
  type: String - one of predifined options
  reason: String
  decidedBy: Contributor
  necessity: String - One of 'possible'|'recommended'|'important'|'critical'
  dimensions: [Number, Number, Number]
  appearance: String - text
  weight: Number
*/
resolution: [Number, Number]
pixelDensity: Number
brightness: Number
contrastRatio: Number
colorDepth: Number
colorProfile: String
modes3D: String
displayType: String
screenDimensions: [Number, Number]
screenDiagonal: Number
aspectRatio: String
responseTime: Number
lens: {
  focalLength: Number
  shift: boolean
  throwRatio: Number
}
speakers: String
audibleNoise: Number
```
#### AudioEquipment
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : {
    displayUrl: String
    storageUri: String
  }[]
  type: String - one of predifined options
  reason: String
  decidedBy: Contributor
  necessity: String - One of 'possible'|'recommended'|'important'|'critical'
  dimensions: [Number, Number, Number]
  appearance: String - text
  weight: Number
*/
sensitivity: String
frequencyResponse: String
impedance: Number
```
#### PlaybackEquipment
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : {
    displayUrl: String
    storageUri: String
  }[]
  type: String - one of predifined options
  reason: String
  decidedBy: Contributor
  necessity: String - One of 'possible'|'recommended'|'important'|'critical'
  dimensions: [Number, Number, Number]
  appearance: String - text
  weight: Number
*/
processorCores: Number
processorSpeed: Number
processorArchitecture: String
memoryAmount: Number
memoryType: String
graphicsMemoryAmount: Number
graphicsMemoryType: String
storageAmount: String
storageType: String
os: String
osVersion: Number
```
______
account
 artworks
 artists
 shows

 collections
 places
 collectors
 curators
 publications

 artworks >-< artists
 artworks >- iteration -< shows
 shows >-< places
 artworks >-< collectors


artworks.{artworkId}.artists.{artistId}
artworks.{artworkId}.shows.{showId}

artists.{artistId}.artworks.{artworkId}

