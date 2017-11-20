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
#### Artwork:
    
``` javascript
accountId: string
published: boolean
title: string - *required, default: 'Untitled'
source: {
    type: 'video'|'html'
    url: string
}
thumbnail: {
    displayUrl: string
    storageUri: string
}
preview:{
    type: 'video'|'gif'|'slideshow'
    url: string
}
year: string
credits:{
    userId: string
    fullName: string
    role: string - one of the predifined options
}[]
description: string - allowed html tags: <a> <p> <b> <i> <h123>
controls: Control[]
iterations: Iteration[]
shows: {
    showId: string
    title: string
    date: {
        start: Date
        end: Date
    }
    place: Place
}[]
```
          
#### Iteration:

Based on Iteration Report by Guggenheim Conservation Department

https://www.guggenheim.org/wp-content/uploads/2015/11/guggenheim-conservation-iteration-report-2012.pdf
 
``` javascript
id: string
name: string
thumbnail: {
  displayUrl: string
  storageUri: string
}
date: Date,
exhibitions: ShowBasic[],
contributors: {
  id: string
  fullName: string
  role: string - one of the predifined options
}[]
supervisedBy: {
  id: string
  fullName: string
  role: string - one of the predifined options
}
installation: {
  installedBy: {
   id: string
   fullName: string
   role: string - one of the predifined options|or custom
 }[]
  withArtist: boolean,
  artistInfluence: Note
}
documentation: {
  images: getValueFromObj(data, 'documentation/images', []),
  video: getValueFromObj(data, 'documentation/video', []),
  technicalDrawings: field('url[]'),
  notes: field('Note[]'),
  artistInterview: field('Note'),
  assistantInterview: field('Note'),
  other: field('url[]')
},
evaluation: fieldsGroup({
  notes: field('Note[]'),
  approvedByArtist: false,
  warnings: field('Note[]')
}),
comments: field('Comment[]'),
publications: field('Publication[]'),
space: {
  context: IterationComponent,
  floorPlan: IterationComponent,
  dimensions: IterationComponent,
  fakeWalls: IterationComponent,
  ceilingHeight: IterationComponent,
  ceiling: IterationComponent,
  wall: IterationComponent,
  floor: IterationComponent,
  acoustic: IterationComponent,
  lighting: IterationComponent,
  entranceExit: IterationComponent,
  visitorFlow: IterationComponent,
  displayPosition: IterationComponent,
  playerPosition: IterationComponent,
  projectionDistances: IterationComponent,
  screens: IterationComponent,
  imageSize: IterationComponent,
  imagePlacement: IterationComponent,
  projectionSurface: IterationComponent
},
exhibitionCopies: fieldsGroup({ /* we probably don't need this */ }),
equipment: {
  visual: [new DisplayEquipment()],
  audio: [new AudioEquipment()],
  playback: [new PlaybackEquipment()],
  other: field('IterationComponentList')
},
otherComponents: field('IterationComponentList'),
technicalSetup: {
  looped: IterationComponent,
  timed: IterationComponent,
  synched: IterationComponent,
  controlled: IterationComponent,
  amperageInSpaceAtEquipment: IterationComponent,
  conditionedPower: IterationComponent,
  cabling: IterationComponent,
  settings: IterationComponent,
  other: IterationComponent
}
```

#### Note:
```
created: Date
modified: Date
author: Contributor
text : string
attachments : {
  displayUrl: string
  storageUri: string
}[]
```
#### IterationComponent:
```
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
```

#### Contributor:
```
userId: string
fullName: string
role: string - One of the predifined options.  
```
_The role options depend on the context where Contributor type is used (inside Artwork, Iteration, Account etc.)_



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

