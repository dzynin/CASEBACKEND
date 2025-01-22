import React from 'react'
import Form from 'react-bootstrap'
import {Button, Alert, Spinner} from 'react-bootstrap'
import axios from "axios";
import { BASE_URL_DEV } from "../utils";

export default class TextAnonymizer extends React.Component{
    state={
        entities:{
            PERSON:true,
            DATE:false,
            NORP:false,
            ORG:false,
            GPE:false,
            LANGUAGE:false,
            MONEY:false
        },
        fake_names:false,
        text:"",
        alert:false,
        showResult:false,
        result:"",
        postRequested:false,
        inProgress:false
    }

    fileRef = new React.createRef()

    setEntities=(event)=>{

        let entities = this.state.entities
        entities[event.target.name] = event.target.checked
        this.setState(()=>({entities:entities}))
    }

    handleFictional=()=>{
        this.setState((oldState)=>({fake_names:!oldState.fake_names}))
    }

    handleTextChange=(event)=>{
        let new_value = event.target.value
        this.setState(()=>({text: new_value}))
    }

    handleCopyText=async()=>{
        navigator.clipboard.writeText(this.state.result)
            .then(() => {
                console.log("text copied")
                })
            .catch(err => {
                console.log('Something went wrong', err);
                 });
    }


    handleTextAnonymize = async () => {
        try {
          this.setState(()=>({postRequested:true, inProgress:true}))
          const entities = this.state.entities
          let entitiesArray=[]
          Object.keys(entities).forEach((entity)=>{
              if(entities[entity]=== true){
                entitiesArray.push(entity)
              }
            })
          const result = await axios.post(
            `${BASE_URL_DEV}/textanonymizer`,
            {
                fake_names:this.state.fake_names,
                text: this.state.text,
                entities: entitiesArray
            }
          )
          console.log(result);

          this.setState(()=>({result:result.data, showResult:true,postRequested:false,inProgress:false}))
        } 
        catch (error) {
            console.log("error",error);
            this.setState(()=>({alert:true,postRequested:false,inProgress:false}))
        }
      }

      removeAlert=()=>{
          this.setState(()=>({alert:false}))
      }
    render(){
        return(
            <div className='dashboard-view  bg-dark p-5 text-center '>
                <Form className='d-flex jusitify-content-center flex-column'>
                    <Form.Group className='text-left'>
                      <h4 className='font-weight-bold'>
                        Which type of names would you like to anonymize?
                      </h4>
                      <Form.Check as='input'
                        type="switch"
                        id="switch-person"
                        label="Person"
                        checked={this.state.entities.PERSON}
                        onChange={this.setEntities}
                        name="PERSON"/> 
                       <Form.Check 
                        type="switch"
                        id="switch-date"
                        label="Date"
                        checked={this.state.entities.DATE}
                        onChange={this.setEntities}
                        name="DATE"/>      
                       <Form.Check 
                        type="switch"
                        id="switch-norp"
                        label="Nationalities or religious or political groups"
                        checked={this.state.entities.NORP}
                        onChange={this.setEntities}
                        name="NORP"/> 
                       <Form.Check 
                        type="switch"
                        id="switch-organizations"
                        label="Companies, agencies, institutions, etc"
                        checked={this.state.entities.ORG}
                        onChange={this.setEntities}
                        name="ORG"/>         
                       <Form.Check 
                        type="switch"
                        id="switch-countries"
                        label="Countries, cities, states"
                        checked={this.state.entities.GPE}
                        onChange={this.setEntities}
                        name="GPE"/>       
                       <Form.Check 
                        type="switch"
                        id="switch-language"
                        label="Language"
                        checked={this.state.entities.LANGUAGE}
                        onChange={this.setEntities}
                        name="LANGUAGE"/>
                       <Form.Check 
                        type="switch"
                        id="switch-money"
                        label="Monetary value"
                        checked={this.state.entities.MONEY}
                        onChange={this.setEntities}
                        name="MONEY"/>   
                    </Form.Group>
                    <Form.Check 
                        className='text-left text-info font-weight-bold mb-4'
                        custom
                        type="checkbox"
                        id={`custom-checkbox`}
                        label={`Replace names (people, countries, languages, etc.) with fictional names`}
                        checked={this.state.fake_names}
                        onChange={this.handleFictional}
                    />
                    <Form.Group   controlId="exampleForm.ControlTextarea1">
                      <Form.Label style={{fontSize:18}}>Enter text to anonimize below:</Form.Label>
                      <Form.Control value={this.state.text} onChange={this.handleTextChange} as="textarea" rows={3} />
                    </Form.Group>
                </Form>
                <Button className='font-weight-bold' disabled={this.state.postRequested} variant="info" onClick={this.handleTextAnonymize}>
                   Anonimize text
                </Button>
                {this.state.inProgress&&<div>
                <Spinner className='mt-4' animation="grow" variant="info"/>
                </div>}
                {/* Error alert if post request didnt go through */}
                <AlertDismissibleExample visible={this.state.alert} handlClose={this.removeAlert}/>
                {this.state.showResult&&<div className='mt-3 bg-dark'>
                    <div className='text-light text-left mb-2'>
                        Text after Anonymization:
                    </div>
                    <div className='overflow-auto border border-success border-1 text-light p-3' style={{maxHeight:120}}>
                        {this.state.result}
                    </div>
                    <div className='mt-2 mb-2'>
                    <button className='btn btn-secondary mr-1 btn-sm'  style={{fontSize:15}} onClick={this.handleCopyText}>
                        Copy
                    </button>
                    <a download= "anonymizedText.txt" className='btn btn-secondary btn-sm' style={{fontSize:15}} href={window.URL.createObjectURL(new Blob([this.state.result],
                    { type: "text/plain" }))}  >
                        Save result as text
                    </a>
                    </div>

                </div>}

            </div>
        )
    }
}


class  AlertDismissibleExample extends React.Component{


    render(){
    
    if (this.props.visible) {
      return (
        <Alert variant="danger mt-2" dismissible onClose={() => this.props.handlClose() }>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            Probably Network problem try again later.
          </p>
        </Alert>
      );
    }

    return null  
    }
}