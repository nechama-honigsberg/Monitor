// import React, { useState, useRef } from 'react';
import $ from 'jquery';

const postLabels = async (url, formData, successCallback, errorCallback) => {
    try {
      $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        success: successCallback,
        error: errorCallback
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  export default postLabels;