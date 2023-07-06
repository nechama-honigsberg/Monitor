import React, { useState, useRef } from 'react';
// import $ from 'jquery';

import './LabelManager.css';
import postLabels from './apiCall';

const LabelManager = () => {
    const [labelData, setLabelData] = useState('');
    const [idLabel, setIdLabel] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('he');
    const [isCheckedLongText, setIsCheckedLongText] = useState(false);
    const [isCheckedRTL, setIsCheckedRTL] = useState(false);
    const [buttonColor, setButtonColor] = useState('red');
    const [responseLabels, setResponseLabels] = useState('');
    const [hebrewLabel, setHebrewLabel] = useState('');
    const [englishLabel, setEnglishLabel] = useState('');
    const [russianLabel, setRussianLabel] = useState('');

    const inputRefLabelData = useRef(null);
    const inputRefCheckSave = useRef(null);

    const handleCheckboxChange = (event) => {
        setIsCheckedLongText(event.target.checked);
    };
    const handleCheckboxRTLChange = (event) => {
        setIsCheckedRTL(event.target.checked);
    };

    const handleButtonPlusClick = () => {
        setIdLabel('new');
        setLabelData('');
        setSelectedLanguage('he');
        setResponseLabels('');
        inputRefCheckSave.current.value = '';
        inputRefLabelData.current.focus();
    };

    const handleInputChange = (event) => {
        var formData = new FormData();
        formData.append("req", "labels");

        if (!isNaN(event.target.value)) {
            formData.append("id", event.target.value);
        } else {
            formData.append("query", event.target.value);
        }

        const successCallback = function (response) {
            const parsedResponse = JSON.parse(response);
            setResponseLabels(parsedResponse);
        };

        const errorCallback = function (error) {
            console.error('Error:', error);
        };

        postLabels('https://api.monitorcare.co.il/pharma', formData, successCallback, errorCallback);
    };

    const handleLanguageChange = (language) => {

        setSelectedLanguage(language);
        if (language === 'he') {
            setLabelData(hebrewLabel)
        } else if (language === 'en') {
            setLabelData(englishLabel)
        } else if (language === 'ru') {
            setLabelData(russianLabel)
        }
    };

    const handleCancelButtonClick = () => {
        const confirmed = window.confirm('Are you sure to cancel?');
        if (confirmed) {
            setLabelData('');
            setSelectedLanguage('he');
            setButtonColor('midnightblue');
        }
    };

    const handleSaveButtonClick = async () => {
        const confirmed = window.confirm('Save the label?');
        if (confirmed) {
            const formData = new FormData();
            formData.append("req", "labels");

            if (idLabel === 'new') {
                formData.append("id", 0);
            } else {
                formData.append("id", idLabel);
            }


            const updatedLabel = {};
            if (hebrewLabel) {
                Object.assign(updatedLabel, { he: hebrewLabel });
            }
            if (englishLabel) {
                Object.assign(updatedLabel, { en: englishLabel });
            }
            if (russianLabel) {
                Object.assign(updatedLabel, { ru: russianLabel });
            }

            formData.append("save", JSON.stringify(updatedLabel));

            const successCallback = function (response) {
                const parsedResponse = JSON.parse(response);
                const id = parsedResponse.id;
                setIdLabel(id);
                setButtonColor('midnightblue');
                alert("The label has been saved successfully :)");
            };

            const errorCallback = function (error) {
                console.error('Error:', error);
            };

            await postLabels('https://api.monitorcare.co.il/pharma', formData, successCallback, errorCallback);
        }
    };

    const checkSaveLabel = () => {
        if (labelData) {
            const confirmed = window.confirm('You did not save the label Are you sure you want to continue?');
            if (confirmed) {
                setLabelData('');
                setIdLabel('');
                setSelectedLanguage('he');
                setResponseLabels('');
                setButtonColor('midnightblue');
                inputRefCheckSave.current.value = '';
            }
            else {
                inputRefCheckSave.current.blur();
            }
        }
    }
    const handleEditLabel = (label) => {
        setLabelData(label);
        setButtonColor('red');

        if (selectedLanguage === 'he') {
            setHebrewLabel(label)
        } else if (selectedLanguage === 'en') {
            setEnglishLabel(label)
        } if (selectedLanguage === 'ru') {
            setRussianLabel(label)
        }
    }

    const handleSelectLabel = (event) => {
        const selectedValue = JSON.parse(event.target.value);
        const { id, label, language } = selectedValue;

        setIdLabel(id);
        setLabelData(label);
        setSelectedLanguage(language);

        var formData = new FormData();
        formData.append("req", "labels");
        formData.append("id", id);

        const successCallback = function (response) {
            const parsedResponse = JSON.parse(response);
            parsedResponse.forEach(item => {
                if (item.language === 'en') {
                    setEnglishLabel(item.label);
                } else if (item.language === 'he') {
                    setHebrewLabel(item.label);
                } else if (item.language === 'ru') {
                    setRussianLabel(item.label);
                }
            });
        };

        const errorCallback = function (error) {
            console.error('Error:', error);
        };

        postLabels('https://api.monitorcare.co.il/pharma', formData, successCallback, errorCallback);

    };


    return (
        <div className="all">
            <h1 >Label Manager</h1>
            <button className="plus-button" onClick={handleButtonPlusClick}>+</button>
            <input
                type="text"
                onChange={handleInputChange}
                placeholder="Enter text or a number to search label"
                style={{ marginLeft: "10px", width: "300px" }}
                onFocus={checkSaveLabel}
                ref={inputRefCheckSave}
            />
            <label className='checkbox'>
                <input
                    type="checkbox"
                    checked={isCheckedLongText}
                    onChange={handleCheckboxChange}
                />
                long text
            </label>
            <label className='checkbox'>
                <input
                    type="checkbox"
                    checked={isCheckedRTL}
                    onChange={handleCheckboxRTLChange}
                />
                RTL
            </label>
            < div className='dropdown_labels' >
                <select
                    className='response_labels'
                    size={responseLabels.length + 1}
                    onChange={handleSelectLabel}
                >
                    <option>Select label</option>
                    {responseLabels.length > 0 && responseLabels.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)} className='response_list'>
                            {item.id} | {item.label}
                        </option>
                    ))}
                </select>

            </div>
            <div className="below_div">
                <div className="id_area">
                    <h2>ID</h2>
                    <div>{idLabel}</div>
                    <div className="dropdown">
                        <div className="dropdown-toggle">
                            <h2>Languages:</h2>
                            <ul className="dropdown-options">
                                <li
                                    onClick={() => handleLanguageChange('he')}
                                    className={selectedLanguage === 'he' ? 'selected' : ''}
                                >
                                    he
                                </li>
                                <li
                                    onClick={() => handleLanguageChange('en')}
                                    className={selectedLanguage === 'en' ? 'selected' : ''}
                                >
                                    en
                                </li>
                                <li
                                    onClick={() => handleLanguageChange('ru')}
                                    className={selectedLanguage === 'ru' ? 'selected' : ''}
                                >
                                    ru
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="details_panel">
                    <h2>Label</h2>
                    <div>
                        <textarea
                            id="edit_label"
                            className="label_input"
                            rows={8}
                            placeholder="Label"
                            ref={inputRefLabelData}
                            onChange={(e) => { handleEditLabel(e.target.value) }}
                            value={labelData}
                        ></textarea>
                    </div>
                    <button className="below_button" onClick={handleCancelButtonClick}>
                        Cancel
                    </button>
                    <button className="below_button" style={{ backgroundColor: buttonColor }} onClick={handleSaveButtonClick}>
                        Save
                    </button>
                </div>
            </div>
        </div >
    );

};

export default LabelManager;
