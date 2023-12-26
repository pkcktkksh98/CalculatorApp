import { AutoTextSize } from 'auto-text-size';
import React from 'react'

const NumericFormat = ({value, maxLimit,className,autoTextSize}) => {
    let formatedText = Number(value);
    if(maxLimit && value.toString().length>maxLimit){
        //if maxLimit enabled convert the number to scientific notation
        //if larger than maxLimit

        formatedText = Number.parseFloat(formatedText).toExponential(2);
    }
    //add thousand seperator
    formatedText=formatedText.toLocaleString();
    // for result let add auto text resize to make text smaller if there is no space left and vice versa

    return <span className={`select-none ${className}`}>
        {autoTextSize?(
            <AutoTextSize
                mode={autoTextSize.mode}
                minFontSizePx={autoTextSize.minFontSizePx}
                maxFontSizePx={autoTextSize.maxFontSizePx}
                as={"p"}
                className='ml-auto'
            >
            {formatedText}
            </AutoTextSize>
        ):(formatedText
        )}
    </span>;
};

export default NumericFormat;