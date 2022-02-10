import CurrentLocation from "./currentLocation.js";
import{setPlaceholderText,
       displayError,
       updateScreenReaderConfirmation,
       displayApiError,
       updateDisplay}from './domfunctions.js'
import{cleanText,
       setLocationObject,
       getHomeLocation,
       getCoordsFromApi} from './datafunction.js'
const currentLoc=new CurrentLocation()
const initApp=()=>{
    const getLoc=document.getElementById('getLocation')
    getLoc.addEventListener('click',getGeoWeather)
    const getHome=document.getElementById('home')
    getHome.addEventListener('click',loadWeather)
    const saveButton=document.getElementById('saveLocation')
    saveButton.addEventListener('click',saveLocation)
    const unitButton=document.getElementById('units')
    unitButton.addEventListener('click',changeUnit)
    const refreshButton=document.getElementById('refresh')
    refreshButton.addEventListener('click',refreshPage)
    const locationEntry=document.getElementById('searchbar__form')
    locationEntry.addEventListener('submit',submitNewLocation)
    setPlaceholderText()
    loadWeather()
}

document.addEventListener('DOMContentLoaded',initApp);

const getGeoWeather=(event)=>{
    if(event){
        if(event.type==='click'){
        }
    }
    if(!navigator.geolocation){
        return geoError()
    }
     return navigator.geolocation.getCurrentPosition(geoSuccess,geoError)
}

const geoError=(errObj)=>{
    const errMsg=errObj?errObj.message:'geoLocation not support';
    displayError(errMsg,errMsg);
}

const geoSuccess=(position)=>{
    const myCoordsObj={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
        name:`lat:${position.coords.latitude},lon:${position.coords.longitude}`
    };
    setLocationObject(currentLoc,myCoordsObj)
    console.log(currentLoc)
}

const loadWeather=(event)=>{
    const savedLocation=getHomeLocation()
    if(!savedLocation&&!event){return getGeoWeather()}
    if(!savedLocation&&event.type==='click'){
        displayError(
            'no home location saved',
            'please enter home'
        )
    }else if(savedLocation&&!event){
        displayHomeLocationWeather(savedLocation)
    }else{
        displayHomeLocationWeather(savedLocation)
    }

}

const displayHomeLocationWeather=(home)=>{
    if(typeof home===String){
        const jsonLocation=JSON.parse(home)
        const coordsObj={
            lat:jsonLocation.lat,
            lon:jsonLocation.lon,
            name:jsonLocation.name,
            unit:jsonLocation.unit
        }
        setLocationObject(currentLoc,coordsObj)
        updateDataAndDisplay(currentLoc)
    }

}

const saveLocation=(event)=>{
    if(currentLoc.getLat()&&currentLoc.getLon()&&event){
        const location={
            lat:currentLoc.getLat(),
            lon:currentLoc.getLon(),
            name:currentLoc.getName(),
            unit:currentLoc.getUnit()
        }
        localStorage.setItem('defaultWeatherLocation',JSON.stringify(location))
        updateScreenReaderConfirmation(`saved ${currentLoc._name} as home location`)
    }
}

const changeUnit=()=>{
    currentLoc.toggleUnit()
    updateDataAndDisplay(currentLoc)
}


const refreshPage=()=>{
    updateDataAndDisplay(currentLoc)
}
const updateDataAndDisplay=async(locationObj)=>{
    const weatherJson=await getWeatherFromCoords(locationObj)
    console.log(weatherJson)
    if(weatherJson){
        updateDisplay(weatherJson,locationObj)
    }
    
}

const submitNewLocation=async(event)=>{
    event.preventDefault();
    const text=document.getElementById('searchbar__text').value
    const entryText=cleanText(text)
    if(!entryText.length) return
    const coodrsData=await getCoordsFromApi(entryText,currentLoc.getUnit())
    if(coodrsData){
        if(coodrsData.cod===200){
            const myCoordsObj={}
            setLocationObject(currentLoc,myCoordsObj)
            updateDataAndDisplay(currentLoc)
        }else{
            displayApiError(coodrsData)
        }
    }else{
        displayError('connection Error','connection Error')
    }
}

