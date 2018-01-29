# pxflux [![Build Status](https://travis-ci.org/pxflux/px-dashboard-web.svg?branch=master)](https://travis-ci.org/pxflux/px-dashboard-web)
<img src="static/img/pxLogo.svg" style="width:600px;height:auto;max-width:100%">

>An online platform and toolset  
for the exhibition, promotion, distribution and collection  
of time based, computational, digital art


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
###### Table Of Content

[**Account**](#account)  

[**Artwork**](#artwork)  
* [_ArtworkBase_](#artworkbase)  
* [_Artwork_](#artwork-1)  
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
<a name="artwork-1"/>
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
<a name="data-types"/>

###

## Account
[[Data Types︎]](#data-types)  

```javascript
title: String
organisationType: String // One of predefined options  
location: Place
description: String // Multi-line, with allowed html tags 
members: Contributor[]
artworks: ArtworkBase[]
collections: Collection[]
artists: ArtistBase[]
shows: ShowBase[]
publications: PublicationBase[]
places: PlaceBase[]
invitations: {}[] // ~ Invitation type 
```

## Artwork 
[[Data Types︎]](#data-types)  

#### ArtworkBase:
```javascript
id: String
accountId: String
published: boolean
title: String // required, default: 'Untitled' 
thumbnail: Attachment
preview: Attachment
year: String
credits: Contributor[]
category: String[]
tags: String[]
statisticsShort: {}
```
#### Artwork:
[[Data Types︎]](#data-types)  

```javascript
/**
 * inherited from ArtworkBase
 * 
 accountId: String
 published: boolean
 title: String - *required, default: 'Untitled'
 thumbnail: Attachment
 preview: Attachment
 year: String
 credits: Contributor[]
 category: String[]
 tags: String[]
 statisticsShort: {}
*/
description: String // Multi-line, allowed html tags 
source: {
    type: 'video'|'html'
    url: String
}
controls: Control[]
iterations: Iteration[]
shows: ShowBase[]
statistics: {}
```
       
## Iteration:
[[Data Types︎]](#data-types)  

**Iterations are properties of an Artwork.**  
<small>
Based on Iteration Report by Guggenheim Conservation Department:  
https://www.guggenheim.org/wp-content/uploads/2015/11/guggenheim-conservation-iteration-report-2012.pdf
</small>
 
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
  other: Equipment[]
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
[[Data Types︎]](#data-types)  

**Collections are properties of an Account.**  
```javascript
accountId: String
accountName: String
name: String
public: Boolean
artworks: ArtworkBase[]
curators: Contributor[]
description: String // Multi-line with allowed html tags 
category: String[]
tags: String[]
```

## Show
[[Data Types︎]](#data-types)  

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
 category: String[]
 tags: String[]
*/
artists: ArtistBase[]
curators: Contributor[]
artworks: ArtworkBase[]
synopsis: String
description: String // Multi-line with allowed html tags 
publications: PublicationBase[]
attachments: Attachment[]
```
## Publication
[[Data Types︎]](#data-types)  
#### PublicationBase:
```javascript

```
#### Publication:
```javascript

```
## Place 
#### PlaceBase:
[[Data Types︎]](#data-types)  

```javascript
name: String
type: String // one of predefined options e.g. 'museum'|'gallery'|etc. 
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
[[Data Types︎]](#data-types) 

```javascript
/**
 * inherited from PlaceBase
 * 
 name: String
 type: String // one of predefined options e.g. 'museum'|'gallery'|etc. 
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
*/
contact:{
  email: String  
  phone: String
}
description: String // Multi-line with allowed html tags 
publications: PublicationBase[]
attachments: Attachment[]
```

## User/Person

#### User:
[[Data Types︎]](#data-types)  

```javascript
userId: String
displayName: String
photo: Attachment
```
#### ArtistBase:
[[Data Types︎]](#data-types) 

```javascript
/**
 * inherited from User
 * 
 userId: String
 displayName: String
 image: Attachment 
 */
artworks: ArtworkBase[]
shows: ShowBase[]
category: String[]
tags: String[]
statisticsShort: {}
```
#### Artist:
[[Data Types︎]](#data-types) 

```javascript
/**
 * inherited from ArtistBase
 * 
 userId: String
 displayName: String
 image: Attachment 
 artworks: ArtworkBase[]
 shows: ShowBase[]
 category: String[]
 tags: String[]
 statisticsShort: {}
 */
url: String
cv: String // Multi-line with allowed html tags. Auto-formatted text 
description: String // Multi-line with allowed html tags 
publications: PublicationBase[]
inCollections: CollectionBase[]
statistics: {}
```

#### Contributor:
[[Data Types︎]](#data-types) 

```javascript
/**
 * inherited from User
 * 
 userId: String
 displayName: String
 image: Attachment 
 */
role: String // One of the predefined options. 
```
_The role options depend on the context where Contributor type is used (inside Artwork, Iteration, Account etc.)_

## "Primitive" Types

#### Attachment:
[[Data Types︎]](#data-types)  

```javascript
displayUrl: String
storageUri: String
type: String // image|video|file|...
ratio: Number
```
#### Video:
[[Data Types︎]](#data-types)  

```javascript
/**
 * inherited from User
 * 
 displayUrl: String
 storageUri: String
 ratio: number
 */
type: 'video' // @override
thumbnail: Attachment
duration: Number
```

#### Control:
[[Data Types︎]](#data-types)  

_Draft_
```javascript
order: Number
icon: String|Attachment
label: String
type: String // 'keyboard'|'mouse'|'function'|'custom' 
value: {
  keyCode: String 
  modifier: String // 'shiftKey'|'ctrlKey'|'altKey'|'metaKey' 
  type: String // 'keydown'|'keyup'|'keypress' 
}
```

#### Record:
[[Data Types︎]](#data-types) 

```javascript
created: Date
modified: Date
author: Contributor
text : String
attachments : Attachment[]
```

## Iteration Specific
[[Data Types︎]](#data-types)  

#### Note:
```javascript
/**
 * inherited from Record
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : Attachment[]
*/
onBehalfOf: Contributor
```

#### IterationComponent:
[[Data Types︎]](#data-types) 

```javascript
/**
 * inherited from Note
 * 
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : Attachment[]
  onBehalfOf: Contributor
*/
type: String /* One of predefined options */
quantity: Number
reason: String
decidedBy: Contributor
necessity: String // One of 'possible'|'recommended'|'important'|'critical' 
```
#### Equipment:
[[Data Types︎]](#data-types)
  
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : Attachment[]
  onBehalfOf: Contributor
  quantity: Number
  reason: String
  decidedBy: Contributor
  necessity: String // One of 'possible'|'recommended'|'important'|'critical' 
*/
type: String // @override One of predefined options (equipment specific) 
dimensions: [Number, Number, Number]
appearance: String // Multi-line 
weight: Number
```
#### DisplayEquipment
[[Data Types︎]](#data-types)  

<small>Taken partly from http://www.projectorcentral.com</small>
```javascript
/**
 * inherited from Equipment
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : Attachment[]
  onBehalfOf: Contributor
  quantity: Number
  reason: String
  decidedBy: Contributor
  necessity: String // One of 'possible'|'recommended'|'important'|'critical' 
  dimensions: [Number, Number, Number]
  appearance: String // Multi-line 
  weight: Number
*/
type: String // @override One of monitor|projector|oculus 
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
[[Data Types︎]](#data-types)  

```javascript
/**
 * inherited from Equipment
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : Attachment[]
  onBehalfOf: Contributor
  quantity: Number
  reason: String
  decidedBy: Contributor
  necessity: String // One of 'possible'|'recommended'|'important'|'critical' 
  dimensions: [Number, Number, Number]
  appearance: String // Multi-line 
  weight: Number
*/
type: String // @override One of loudspeakers|headphones|... 
sensitivity: String
frequencyResponse: String
impedance: Number
```
#### PlaybackEquipment
[[Data Types︎]](#data-types)  

```javascript
/**
 * inherited from Equipment
 *
  created: Date
  modified: Date
  author: Contributor
  text : String
  attachments : Attachment[]
  onBehalfOf: Contributor
  quantity: Number
  reason: String
  decidedBy: Contributor
  necessity: String // One of 'possible'|'recommended'|'important'|'critical' 
  dimensions: [Number, Number, Number]
  appearance: String // Multi-line 
  weight: Number
*/
type: String // @override One of desktop|handheld|single board|... 
cpu:{
  cores: Number
  speed: Number
  architecture: String
}
memory:{
  amount: Number
  type: String
}
graphics:{
  memoryAmount: Number
  memoryType: String
}
storage:{
  amount: String
  type: String
}
connectivity:{
  bluetoothType: String
  wifiType: String
  ethernetType: String
}
os: String
osVersion: Number
```
