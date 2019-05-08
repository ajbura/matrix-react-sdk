/*
Copyright 2019 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import MatrixClientPeg from '../../../MatrixClientPeg';

export default class ReactionDimension extends React.PureComponent {
    static propTypes = {
        options: PropTypes.array.isRequired,
        title: PropTypes.string,
        // The Relations model from the JS SDK for reactions
        reactions: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            selected: this.getInitialSelection(),
        };
    }

    getInitialSelection() {
        const myReactions = this.getMyReactions();
        if (!myReactions) {
            return null;
        }
        const { options } = this.props;
        let selected = null;
        for (const { key, content } of options) {
            const reactionExists = myReactions.some(mxEvent => {
                return mxEvent.getContent()["m.relates_to"].key === content;
            });
            if (reactionExists) {
                if (selected) {
                    // If there are multiple selected values (only expected to occur via
                    // non-Riot clients), then act as if none are selected.
                    return null;
                }
                selected = key;
            }
        }
        return selected;
    }

    getMyReactions() {
        const reactions = this.props.reactions;
        if (!reactions) {
            return null;
        }
        const userId = MatrixClientPeg.get().getUserId();
        return reactions.getAnnotationsBySender()[userId];
    }

    onOptionClick = (ev) => {
        const { key } = ev.target.dataset;
        this.toggleDimensionValue(key);
    }

    toggleDimensionValue(value) {
        const state = this.state.selected;
        const newState = state !== value ? value : null;
        this.setState({
            selected: newState,
        });
        // TODO: Send the reaction event
    }

    render() {
        const { selected } = this.state;
        const { options } = this.props;

        const items = options.map(option => {
            const disabled = selected && selected !== option.key;
            const classes = classNames({
                mx_ReactionDimension_disabled: disabled,
            });
            return <span key={option.key}
                data-key={option.key}
                className={classes}
                onClick={this.onOptionClick}
            >
                {option.content}
            </span>;
        });

        return <span className="mx_ReactionDimension"
            title={this.props.title}
        >
            {items}
        </span>;
    }
}
