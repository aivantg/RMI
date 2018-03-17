import React from 'react';
import { debounce } from 'lodash';

class FreeOption extends React.Component {
  componentDidMount() {
    this.trySaveAnswer = debounce(function (value) {
      this.props.onSave(null, value);
    }, 3000);
  }

  onChange(value, force) {
    this.props.onChange(null, value);
    this.trySaveAnswer(value);
    if (force) {
      this.trySaveAnswer.flush();
    }
  }

  render() {
    return (<div>
      <textarea value={this.props.answer ? this.props.answer.text : ""}
                onChange={(e) => this.onChange(e.target.value)}
                onBlur={(e) => this.onChange(e.target.value, true)} />
    </div>)
  }
}

export default FreeOption;
