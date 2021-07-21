/*
Copyright 2021 Šimon Brandner <simon.bra.ag@gmail.com>

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

import React from "react";
import { MatrixCall } from "matrix-js-sdk/src/webrtc/call";
import { CallFeed } from "matrix-js-sdk/src/webrtc/callFeed";
import VideoFeed from "./VideoFeed";
import classNames from "classnames";

interface IProps {
    feeds: Array<CallFeed>;
    call: MatrixCall;
    hideLocalFeeds: boolean;
    pipMode: boolean;
}

export default class CallViewSidebar extends React.Component<IProps> {
    render() {
        const feeds = this.props.feeds.map((feed) => {
            if (feed.isLocal() && this.props.hideLocalFeeds) return;

            return (
                <VideoFeed
                    key={feed.stream.id}
                    feed={feed}
                    call={this.props.call}
                    primary={false}
                    pipMode={this.props.pipMode}
                />
            );
        });

        const className = classNames("mx_CallViewSidebar", {
            mx_CallViewSidebar_pipMode: this.props.pipMode,
        });

        return (
            <div className={className}>
                { feeds }
            </div>
        );
    }
}
