import { Divide, Dot, Equals, Percent, PlusMinus, X , Minus, Plus, Clock} from '@phosphor-icons/react';
import { ArrowUUpLeft } from '@phosphor-icons/react/dist/ssr';
import React,{useEffect, useRef, useState} from 'react'
import Button from './Button';
import { render } from 'react-dom';

const Buttons={
    row1:[
        {
            value:"AC",
            label:"AC",
            className:"bg-light-300 dark:bg-dark-300",
            type:"clear",
        },
        {
            value:"+/-",
            label:<PlusMinus size={25}/>,
            className:"bg-light-300 dark:bg-dark-300",
            type:"plusminus",
        },
        {
            value:"%",
            label:<Percent size={25}/>,
            className:"bg-light-300 dark:bg-dark-300",
            type:"percent",
        },
        {
            value:"/",
            label:<Divide size={25}/>,
            className:"!bg-primary text-white",
            type:"operator",
        },
    ],
    row2:[
        {value:"7",label:"7",type:"number",},
        {value:"8",label:"8",type:"number",},
        {value:"9",label:"9",type:"number",},
        {
            value:"*",
            label:<X size={25}/>,
            className:"!bg-primary text-white",
            type:"operator",
        },
    ],
    row3:[
        {value:"4",label:"4",type:"number",},
        {value:"5",label:"5",type:"number",},
        {value:"6",label:"6",type:"number",},
        {
            value:"-",
            label:<Minus size={25}/>,
            className:"!bg-primary text-white",
            type:"operator",
        },
    ],
    row4:[
        {value:"1",label:"1",type:"number",},
        {value:"2",label:"2",type:"number",},
        {value:"3",label:"3",type:"number",},
        {
            value:"+",
            label:<Plus size={25}/>,
            className:"!bg-primary text-white",
            type:"operator",
        },
    ],
    row5:[
        {value:"0",label:"0",className:"col-span-2", type:"number",},
        {value:".",label:<Dot size={25}/>,type:"dot",},
        {
            value:"=",
            label:<Equals size={25}/>,
            className:"!bg-primary text-white",
            type:"equal",
        },
    ]
    
}
const Calculator = () => {
    const buttonRef = useRef([]);
    const backspaceBtnRef=useRef(null);
    const [inputValue, setInputValue]=useState([]);
    const [result,setResult]= useState(0);
    const [calculated,setCalculated]=useState(false);
    const [history,setHistory]=useState([]);

    const handleButtonClick=(value)=>{
        //if value calculated
        if(calculated&& value !== "="){
            setInputValue([]);
            setResult(0);
            setCalculated(false);

        }

        //Get all thge Clicked button detailed from buttons array
        const button=Object.values(Buttons)
            .flat()
                .find((item)=> item.value === value);

        // if value calculated add current result as lastInputValue

        let resultValue;
        if(calculated){
            //if result value is too big we will convert it to scientific notation so convert it back to numner then to a string
            resultValue=BigInt(result).toString();
        }

        // we wil store input value in an array
        //get the last element of array
        const lastInputValue = calculated
        ?{value:resultValue, label:resultValue, type:"number"}
        :inputValue[inputValue.length-1];

        // function to handle uninary operations
        
        const handleUnaryOperations=(operation)=>{
            if(lastInputValue&&lastInputValue.type==="number"){
                //perform the funtion on the last value
                const newInputValue ={
                    ... lastInputValue,
                    value:operation(lastInputValue.value),
                    label:operation(lastInputValue.value)
                };
                // update the value in inputValue array
                setInputValue((prev)=> [...prev.slice(0,-1), newInputValue])
            }
        };
        // function to handle Numbers
        const handleNumber =() =>{
            if(lastInputValue && lastInputValue.type==="number"){
                // if last value is also a number than add in the last value
                let newValue = lastInputValue.value;
                if(lastInputValue.value.toString().length<15){
                    // add a limit of 15 char
                    newValue=lastInputValue.value+value;

                }
                const newInputValue={
                    ...lastInputValue,
                    value:newValue,
                    label:newValue,
                };
                // update the new vvalue
                setInputValue((prev)=> [...prev.slice(0,-1),newInputValue]);
            } else{
                //if last value is not a number then just add correct as new 
                setInputValue((prev)=>[...prev,button]);

            }
        };

        //function to handle operators
        const handleOperator =()=>{
            if (inputValue.length>0){
                //only allow operator if input value not empty
                if(lastInputValue&&lastInputValue.type==="operator"){
                    //if last value is already an operator then just replace it
                    const newInputValue={
                        ...lastInputValue,
                        value:button.value,
                        label:button.label,
                    };   
                    setInputValue((prev)=>[...prev.slice(0,-1),newInputValue]);
                }else{
                    //if last value is not operator than add operator
                    setInputValue((prev)=>[...prev.slice(0,-1),lastInputValue,button]);
                }
            }            
        };

        //function to handle Dot
        const handleDot = () =>{
            if(lastInputValue && lastInputValue.type === "number"){
                // if last value os number add dot
                let newValue = lastInputValue.value;
                if (!lastInputValue.value.includes(".")){
                    //if dot not already exist add one
                    newValue=lastInputValue.value+"."
                }
                const newInputValue={
                    ...lastInputValue,
                    value:newValue,
                    label:newValue,
                };
                setInputValue((prev)=>[...prev.slice(0,-1),newInputValue]);
            }else if(!lastInputValue|| lastInputValue.type !== "number"){
                //if theres no last value or its not a number
                const newInputValue={value:"0.", label:"0.",type:"number"};
                setInputValue((prev)=>[...prev,newInputValue]);
            }
        };

        //function to handle Clear
        const handleClear = () =>{
            setInputValue([]);
            setResult(0);
            setCalculated(false);
        };

        const handleEqual =()=>{
            if(inputValue.length>0){
                calculate();
            }
        }

        switch(button.type){
            case "number":
                handleNumber();
                break;
            case "operator":
                handleOperator();
                break;
            case "plusminus":
                handleUnaryOperations((num)=> -num);
                break;
            case "percent":
                handleUnaryOperations((num) => num/100);
                break;
            case "dot":
                handleDot();
                break;
            case "clear":
                handleClear();
                break;
            case "equal":
                handleEqual();
                break;
            
        }
    };
 
    const handleKeyButtonPress=(btn)=>{
        buttonRef.current[btn].click();
        // add a click animation
        buttonRef.current[btn].classList.add("ring-2","ring-blue-500");
        //remove after 2ms
        setTimeout(()=>{
            buttonRef.current[btn].classList.remove("ring-2","ring-blue-500");
        },200);
    };

    const handleKeyPress =(e)=>{
        if (buttonRef.current[e.key]){
            //if pressed key is from buttons
            handleKeyButtonPress(e.key);
        }
        //if backspace pressed
        if(e.key==="Backspace"){
            //handleBackspace
            backspaceBtnRef.current && backspaceBtnRef.current.click();
        }
        if(e.key==="Enter"){
            handleKeyButtonPress("=");
        }
        if(e.key==="ArrowUp"){
            console.log("arrow");
            history.length>1 && handleRestoreHistory(history[history.length-1]);
        }
    };

    useEffect(()=>{
        document.addEventListener("keydown",handleKeyPress);
        return ()=>{
            document.removeEventListener("keydown",handleKeyPress);
        };
    },[]);

    const handleBackspace=()=>{
        if(inputValue.length>0){
            const lastInputValue=inputValue[inputValue.length -1];
            if(
                lastInputValue.type==="number"&&
                lastInputValue.value.toString().length>1
            ){
                const newInputValue={
                    ...lastInputValue,
                    value:lastInputValue.value.slice(0,-1),
                    label:lastInputValue.value.slice(0,-1),
                };
                setInputValue((prev)=>[...prev.slice(0,-1),newInputValue]);
            }else{
                setInputValue((prev)=>[...prev.slice(0,-1)]);
            }
        }
    };

    const calculate=()=>{
        const inputValueToCalculate = [...inputValue];
        const lastInputValue=inputValueToCalculate[inputValueToCalculate.length-1];

        //if there is an operator in last, remove it
        if(lastInputValue&&lastInputValue.type ==="operator"){
            inputValueToCalculate.pop();
            setInputValue(inputValueToCalculate);
        }

        //create expressio from input value
        const expression = inputValueToCalculate.map((item)=>{
            //remove leading zeroes
            if(item.type==="number"){
                return Number(item.value);
            }
            return item.value;
        }).join("");
        //solve the expression
        try{
            const newResult =eval(expression);
            if(isNaN(newResult || !isFinite(newResult))){
                //if not anumber
                throw new Error ("invalid Expression")
            }
            setResult(newResult);
            setCalculated(true);
            setHistory((prev)=>[
                ...prev,
                {
                    inputValue,
                    result:newResult,
            },
            ]);
        }catch(error){
            console.log(error)
        }
    };

    const handleRestoreHistory=(historyItem)=>{
        //restore all values
        setInputValue(historyItem.inputValue);
        setResult(historyItem.result);
        setCalculated(true);
        //remove last item from history
        setHistory((prev)=>prev.slice(0,-1));

    };

    const renderInputValue=()=>{
        //if input value empty just return a 0
        if (!inputValue.length) return <span>0</span>;

        return inputValue.map((item,index)=> {
            return item.type === "number"
            ?(
                //lets format this long numbers with thousand seperator
                <span key={index}>{item.label}</span>)
            :(// if its operator add class primary
                <span key={index} className='text-primary'>{item.label}</span>
            );
            });
    };
    return(
        <>
            <div className='mb-2 px-4'>
                <div className='flex min-h-[9rem] flex-col item-end justify-end py-4 text-right'>
                {/*history*/}
                {history.length>1 && (
                    <div 
                        className='mb-4 flex cursor-pointer items-center gap-2 rounded-full bg-light-200 px-2 py-0.5 text-xs dark:bg-dark-300'
                        onClick={()=>
                            handleRestoreHistory(
                                history[history.length-2]|| history[history.length-1]
                            )
                        }
                    >
                        <Clock size={15}/>
                        {history[history.length-2].result||history[history.length-1].result}
                    </div>
                    )
                }
                    <span className='w-full text-6xl text-textDark dark:text-white'>
                        {result}
                    </span>
                </div>
            </div>
            <div className='flex item-center justify-center bg-light-100 px-4 py-2 dark:bg-dark-100'>
                <span 
                    className='mr-3 cursor-pointer hover:text-black dark:hover:text_white'
                    ref={backspaceBtnRef}
                    onClick={handleBackspace}
                >
                    <ArrowUUpLeft size={20}/>
                </span>
                <div className='flex w-full item-center overflow-x-auto text-2xl font-extralight [&>*:first-child]:ml-auto'>
                    {
                        renderInputValue()
                    }
                </div>
            </div>
            {/* Keyboard*/}
            <div className='flex items-center justify-between p-4'>
                <div className='flex w-full flex-col gap-1 rounded-lg'>
                    {Object.keys(Buttons).map((key)=>(
                        <div className='grid grid-cols-4 gap-1' key={key}>
                            {Buttons[key].map((item)=>(
                            <Button
                                key={item.value}
                                className={"w-full" + " " + item.className || ""}
                                ref = {(button)=>{
                                    buttonRef.current[item.value]=button;
                                }}
                                onClick={()=> handleButtonClick(item.value)}
                            >
                                {item.label}
                            </Button>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Calculator