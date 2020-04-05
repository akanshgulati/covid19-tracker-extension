# COVID-19 Tracker

A popup extension to see Coronavirus infected patients around the globe. Currently, you can check all countries, Indian states and US states data.

<img src="assets/1400x560.jpg" width="100%"/>

## Tech Stack  
 
 - Using **React** `^16.13.1`
 - Using [Webpack 4](https://webpack.js.org/) and [react-scripts](https://www.npmjs.com/package/react-scripts) for compiling and bundling both popup and background script code.
 - Web-ext for linting firefox plugin
 - Using Yarn for package management
 - Node version - `12.14.0` and Yarn version - `1.19.1`

## File Structure  
- Firefox Directory (/firefox): It contains all files for Firefox plugin  
- Chrome Directory (/chrome): It contains all files for Chrome plugin  
- Static Directory (/public): It contains common static files used in Chrome and Firefox plugins.  
- Src directory (/src): It contains all files related to React for popup script and background script (background.js)
- 
## Development Process  
> In order to use below build processes, you must have **Yarn** and **Node** installed on your machine. 

Use command `yarn` to install React and other essential packages to build

## Build Process  
  
1. **Development Build** :  `yarn start`  
2. **Production Build**: `yarn run chrome-build` (Chrome) & `yarn run firefox-build` (Firefox)


## Third Party Resources
1. React Framework
2. Material UI for React
3. "Lato" font by Google fonts

## Feature Pipeline

 - [ ] Add trend graph
 - [ ] Add Indian district data
 - [ ] Add Other countries' states data

## Support 
You can add your feedback, suggestions, feature request at [here](https://coronatrends.live/support.html?source=github).

## Dev & Design

 - [Akansh](https://twitter.com/akanshgulati) - Development
 - [Chhaviraj](https://twitter.com/chhaviraj) - Design & UX
