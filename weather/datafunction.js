export const setLocationObject=(locationObj,coordsObj)=>{
    const {lat,lon,name,unit}=coordsObj;
    locationObj.setLat(lat)
    locationObj.setLon(lon)
    locationObj.setName(name)
    if(unit){
        locationObj.setUnit(unit)
    }
}


export const getHomeLocation=()=>{
    return localStorage.getItem('defaultWeatherLocation')
}

export const cleanText=(text)=>{
    const regex=/ {2,}/g
    const entryText=text.replaceAll(regex,' ').trim()
    return entryText
}

export const getCoordsFromApi=async (entryText,unit)=>{
    const regex=/^\d+$/g;
    const flag=regex.test(entryText)?'zip':'q'
    try{
    const weatherData=await fetch(`http://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${unit}&appid=74af8b7acaa4e809e704db40e668700b`)
    const jsonData=await weatherData.json()
    return jsonData;
    }catch(err){
        console.log(err.stack)
    }
}