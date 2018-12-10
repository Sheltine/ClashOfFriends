/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { post } from 'axios';

const serverUrl = 'http://localhost:4000';

class ChallengeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
  }

    // eslint-disable-next-line class-methods-use-this
    onError(e) {
        console.log(e, 'error in file-viewer');
      }

    // will send data to server
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.file,
        });
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (a) => {
            console.log('img data ', a.target.result);
            };
        const formData = { file: e.target.result };
        return post(serverUrl, formData)
            .then(response => console.log('result', response));
    }

// check https://www.npmjs.com/package/react-file-viewer/v/0.4.1 for fileviewer
  render() {
    return (
      <div>
        <h1>{this.props.category} Challenge</h1>
        <input name="file" type="file" value={this.state.file} onChange={e => this.handleInputChange(e)} />
      </div>
    );
  }
}

ChallengeForm.propTypes = {
    category: PropTypes.string.isRequired,
};

export default ChallengeForm;
