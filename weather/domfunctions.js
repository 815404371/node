export const displayError=(headerMsg,srMsg)=>{
    updateWeatherLocationHeader(headerMsg);
    updateScreenReaderConfirmation(srMsg)
}

export const updateScreenReaderConfirmation=(message)=>{
    document.getElementById('confirmation').textContent=message
}

export const updateWeatherLocationHeader=(message)=>{
    const h1=document.getElementById('currentForcast__location').textContent
    if(message.indexOf('lat:')!==-1&&message.indexOf('long:')!==-1){
        const msgArray=message.split(' ')
        const mapArray=msgArray.map((msg)=>{
            return msg.replace(':',': ')
        });
        const lat=
            mapArray[0].indexOf('-')===-1
             ? mapArray[0].slice(0,10)
             : mapArray[0].slice(0,11)
             const lon=
             mapArray[1].indexOf('-')===-1
             ?mapArray[1].slice(0,11)
             :mapArray[1].slice(0,12)
             h1.textContent=`${lat}.${lon}`
    }else{
    h1.textContent=message
    }
}

export const displayApiError=(statusCode)=>{
    const properMsg=toProperCase(statusCode.message)
    updateWeatherLocationHeader(properMsg)
    updateScreenReaderConfirmation(`${properMsg}.please try again`)
}

const toProperCase=(text)=>{
    const words=text.split(' ')
    const properWords=words.map(word=>{
        return word.charAt(0).toUpperCase()+word.slice(1)
    })
    return properWords.join(' ')
}

export const setPlaceholderText=()=>{
    const input=document.getElementById('searchbar__text')
    window.innerWidth<400?
    (input.placeholder='city,state,country'):
    (input.placeholder='city,state,country,or zip code')
}

export const updateDisplay=(weatherJson,locationObj)=>{
    fadeDisplay();
    clearDisplay()
    const weatherClass=getWeatherClass(weatherJson.current.weather[0].icon)
    setBGImage(weatherClass)
    const screenReaderWeather=buildScreenReaderWeather(
        weatherJson,
        locationObj)
        updateScreenReaderConfirmation(screenReaderWeather)
        updateLocationWeatherHeader(locationObj.getName())
        //current condtion to dispaly
        const ccArray=creatCurrentConditionDivs(weatherJson,locationObj.getUnit())
        displayCurrentConditions(ccArray)
        displaySixDayForcast(weatherJson)
        setFocusOnSearch();
    fadeDisplay()
}

const fadeDisplay=()=>{
    const cc=document.getElementById('currentForcast')
    cc.classList.toggle('zero-vis')
    cc.classList.toggle('fade-in')
    const sixDay=document.getElementById('dailyForcast')
    sixDay.classList.toggle('zero-vis')
    sixDay.classList.toggle('fade-in')
}

const clearDisplay=()=>{
    const currentConditions=document.getElementById('currentForcast__conditions')
    deleteContent(currentConditions)
    const sixDayForcast=document.getElementById('dailyForcast__content')
    deleteContent(sixDayForcast)
}

const deleteContent=(parentElement)=>{
    let child=parentElement.lastElmentChild
    while(child){
        parentElement.removeChild(child)
        child=parentElement.lastElmentChild
    }
}

const getWeatherClass=(icon)=>{
    const firstTwoChars=icon.slice(0,2)
    const lastChar=icon.slice(2)
    const weatherLookUp={
        '09':'snow',
        '10':'rain',
        '11':'rain',
        '13':'snow',
        '50':'fog',
    }
    let weatherClass;
    if(weatherLookUp.firstTwoChars){
        weatherClass=weatherLookUp.firstTwoChars
    }else if(lastChar==='d'){
        weatherClass='clouds'
    }else{
        weatherClass='night'
    }
    return weatherClass

    }


const setBGImage=(weatherClass)=>{
    document.documentElement.classList.add(weatherClass)
    document.documentElement.classList.forEach(img=>{
        if(img!=weatherClass) document.documentElement.classList.remove(img)
    })
}

const buildScreenReaderWeather=(weatherJson,locationObj)=>{
    const location=locationObj.getName()
    const unit=locationObj.getUnit()
    const tempUnit=unit==='imperial'?'F':'C'
    return `${weatherJson.current.weather[0].description}and
     ${Math.round(Number(weatherJson.current.temp))}`
}

const setFocusOnSearch=()=>{
    document.getElementById('searchbar__text').focus();
}

const creatCurrentConditionDivs=(weatherObj,unit)=>{
    const tempUnit=unit==='imperial'?'F':'C'
    const windUnit=unit==='imperial'?'mph':'m/s'
    const icon=createMainImgDiv(weatherObj.current.weather[0].icon,
        weatherObj.current.weather.description
        );
    const temp=createElem('div','temp',`${Math.round(Number(weatherObj.current.temp))}`)
    const propDesc=toProperCase(weatherObj.current.weather[0],description)
    const desc=createElem('div','desc',propDesc)
    const feelsLike=createElem(
        'div',
        'feels',
        `feels like ${Math.round(Number(weatherObj.current.feels__like))}`)

}

const createMainImgDiv=(icon,altText)=>{
    const iconDiv=createElem('div','icon')
    iconDiv.id='icon';
    const faIcon=translateIconToFontAwesome(icon);
    faIcon.ariaHidden=true
    faIcon.title=altText
    iconDiv.appendChild(faIcon)
    return iconDiv
}

const createElem=(elemType,divClassName,divText,unit)=>{
    const div=document.createElement(elemType)
    div.className=divClassName
    if(divText){
        div.textContent=divText
    }
    if(divClassName==='temp'){
        const unitDiv=document.createElement('div')
        unitDiv.classList.add('unit')
        unitDiv.textContent=unit
        div.appendChild(unitDiv)
    }
    return div
}

const displayCurrentConditions=(currentConditionsArray)=>{
    const ccContainer=document.getElementById('currentForcast__conditions')
    currentConditionsArray.forEach(cc=>{
        ccContainer.appendChild(cc)
    })
}

const displaySixDayForcast=(weatherJson)=>{
    for(let i=1;i<=6;i++){
        const dfArray=createDailyForcastDivs(weatherJson,daily[i])
        displayDailyForcast(dfArray)
    }
}

const createDailyForcastDivs=(dayweather)=>{
    const dayAbbreviationText=getDayAbbreviation(dayweather.dt)
    const dayAbbreviation=createElem('p','dayabbreviation',dayAbbreviation)
    const dayIcon=createDailyForcastIcon(dayweather.weather[0].icon,
        dayweather.weather[0].description)
    const dayHigh=createElem('p','dayHigh',`${Math.round(Number(dayweather.temp.max))}`)
}
const displayDailyForcast=()=>{
    
}

const getDayAbbreviation=(data)=>{
    const dataObj=new Date(data*1000);
    const utcString=dataObj.toUTCString();
    return utcString.slice(0,3).toUpperCase();
}


const createDailyForcastIcon=(icon,altText)=>{
    const img=document.createElement('img')
    if(window.innerWidth<768||window.innerHeight<1025){
        img.src=`htt`
    }
}