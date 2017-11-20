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
## Data Types:

#### ArtworkBasic:
```javascript
accountId: string
published: boolean
title: string - *required, default: 'Untitled'
thumbnail: Attachment
preview:{
    type: 'video'|'gif'|'slideshow'
    url: string
}
year: string
credits: Contributor[]
```
#### Artwork:
```javascript
/**
 * inherited from ArtworkBasic
 * 
 accountId: string
 published: boolean
 title: string - *required, default: 'Untitled'
 thumbnail: Attachment
 preview:{
     type: 'video'|'gif'|'slideshow'
     url: string
 }
 year: string
 credits: Contributor[]
*/
description: string - /* allowed html tags: <a><p><b><i><h1><h2><h3> */
source: {
    type: 'video'|'html'
    url: string
}
controls: Control[]
iterations: Iteration[]
shows: ShowBasic[]
```
          
#### Iteration:

Based on Iteration Report by Guggenheim Conservation Department

https://www.guggenheim.org/wp-content/uploads/2015/11/guggenheim-conservation-iteration-report-2012.pdf
 
```javascript
id: string
name: string
thumbnail: Attachment
date: Date,
exhibitions: ShowBasic[]
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
  Like other url, number of screens etc. */ 
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
#### ShowBase:
```javascript
id: string
title: string
date: {
    start: Date
    end: Date
}
thumbnail: Attachment
url: string
place: Place
```
#### Show:
```javascript
/**
 * inherited from ShowBase
 *
 id: string
 title: string
 date: {
     start: Date
     end: Date
 }
 thumbnail: Attachment
 url: string
 place: Place
*/
artists: ArtistBase[]
curators: Contributor[]
artworks: ArtworkBase[]
synopsis: string
description: string - /* allowed html tags: <a><p><b><i><h1><h2><h3> */
publications: Publication[]
attachments: Attachment[]
```
#### Publication:
```javascript

```

#### User:
```javascript
userId: string
fullName: string
image: Attachment
```
#### ArtistBase:
```javascript
/**
 * inherited from User
 * 
 userId: string
 fullName: string
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
 userId: string
 fullName: string
 image: Attachment 
 artworks: ArtworkBase[]
 shows: ShowBase[]
 */
publications: PublicationBase[]
inCollections: CollectionBase[]
cv: string - formated text
```

#### Contributor:
```javascript
/**
 * inherited from User
 * 
 userId: string
 fullName: string
 image: Attachment 
 */
role: string - One of the predifined options.
```
_The role options depend on the context where Contributor type is used (inside Artwork, Iteration, Account etc.)_

#### Attachment:
```javascript
displayUrl: string
storageUri: string
mimeType: string
```

#### Control:
```javascript
order: number
icon: string|Attachment
label: string
type: string - 'keyboard'|'mouse'|'function'|'custom'
value: {
  keyCode: string 
  modifier: string - 'shiftKey'|'ctrlKey'|'altKey'|'metaKey'
  type: string - 'keydown'|'keyup'|'keypress'
}
```
_It's a draft yet_

#### Record:
```javascript
created: Date
modified: Date
author: Contributor
text : string
attachments : {
  displayUrl: string
  storageUri: string
}[]
```
#### Note:
```javascript
/**
 * inherited from Comment
 *
  created: Date
  modified: Date
  author: Contributor
  text : string
  attachments : {
    displayUrl: string
    storageUri: string
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
  text : string
  attachments : {
    displayUrl: string
    storageUri: string
  }[]
*/
type: string - one of predifined options
reason: string
decidedBy: Contributor
necessity: string - One of 'possible'|'recommended'|'important'|'critical'
```
#### Equipment:
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : string
  attachments : {
    displayUrl: string
    storageUri: string
  }[]
  type: string - one of predifined options
  reason: string
  decidedBy: Contributor
  necessity: string - One of 'possible'|'recommended'|'important'|'critical'
*/
dimensions: [number, number, number]
appearance: string - text
weight: number
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
  text : string
  attachments : {
    displayUrl: string
    storageUri: string
  }[]
  type: string - one of predifined options
  reason: string
  decidedBy: Contributor
  necessity: string - One of 'possible'|'recommended'|'important'|'critical'
  dimensions: [number, number, number]
  appearance: string - text
  weight: number
*/
resolution: [number, number]
pixelDensity: number
brightness: number
contrastRatio: number
colorDepth: number
colorProfile: string
modes3D: string
displayType: string
screenDimensions: [number, number]
screenDiagonal: number
aspectRatio: string
responseTime: number
lens: {
  focalLength: number
  shift: boolean
  throwRatio: number
}
speakers: string
audibleNoise: number
```
#### AudioEquipment
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : string
  attachments : {
    displayUrl: string
    storageUri: string
  }[]
  type: string - one of predifined options
  reason: string
  decidedBy: Contributor
  necessity: string - One of 'possible'|'recommended'|'important'|'critical'
  dimensions: [number, number, number]
  appearance: string - text
  weight: number
*/
sensitivity: string
frequencyResponse: string
impedance: number
```
#### PlaybackEquipment
```javascript
/**
 * inherited from IterationComponent
 *
  created: Date
  modified: Date
  author: Contributor
  text : string
  attachments : {
    displayUrl: string
    storageUri: string
  }[]
  type: string - one of predifined options
  reason: string
  decidedBy: Contributor
  necessity: string - One of 'possible'|'recommended'|'important'|'critical'
  dimensions: [number, number, number]
  appearance: string - text
  weight: number
*/
processorCores: number
processorSpeed: number
processorArchitecture: string
memoryAmount: number
memoryType: string
graphicsMemoryAmount: number
graphicsMemoryType: string
storageAmount: string
storageType: string
os: string
osVersion: number
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

