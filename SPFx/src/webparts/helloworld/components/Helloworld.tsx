import * as React from 'react';
import styles from './Helloworld.module.scss';
import { IHelloworldProps } from './IHelloworldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { MSGraphClient } from '@microsoft/sp-http';
import * as microsoftTeams from "@microsoft/teams-js";

const Helloworld = (props: IHelloworldProps) => {
  const {
    description,
    isDarkTheme,
    environmentMessage,
    hasTeamsContext,
    userDisplayName,
    context
  } = props;

  const [docs, setDocs] = React.useState([]);
  const [selectedDoc, setSelectedDoc] = React.useState("");

  React.useEffect(() => {
    console.log("context", context)
    context.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClient): void => {
        console.log("client", client);

        client
          .api('/me/messages')
          .top(5)
          .orderby("receivedDateTime desc")
          .get((error, messages: any, rawResponse?: any) => {
            console.log("result 1", error, messages, rawResponse);
          });

        client
          .api('/sites/azeusdeveloper.sharepoint.com,47969132-8012-4b78-9bdf-a16c07afba84,706b21c4-ffe4-4b1c-83e2-f098f73fde92/drives/b!MpGWRxKAeEub36FsB6-6hMQha3Dk_xxLg-LwmPc_3pLABSWWub5aRZo8PpyVK4iA/root/children')
          .get((error, messages: any, rawResponse?: any) => {
            console.log("result 2", error, messages, rawResponse);
            setDocs(messages?.value);
          });
      })
  }, [])

  const setHref = (href: string) => {
    setSelectedDoc(href);
  }

  const clearSelectedDoc = () => {
    setSelectedDoc("");
  }

  const submitHandler = (err: any, result: any) => {
    console.log(`Submit handler - err: ${err}`);
    console.log(`Submit handler - result\rName: ${result.name}\rEmail: ${result.email}\rFavorite book: ${result.favoriteBook}`);
  }

  const openTaskModule = () => {
    let taskInfo = {
      title: null,
      height: null,
      width: null,
      url: null,
      card: null,
      fallbackUrl: null,
      completionBotId: null,
    };

    taskInfo.url = "https://contoso.com/teamsapp/customform";
    taskInfo.title = "Custom Form";
    taskInfo.height = 510;
    taskInfo.width = 430;
    microsoftTeams.tasks.startTask(taskInfo, submitHandler);
  }


  return (
    <section className={`${styles.helloworld} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        <h2>Welcome, {escape(userDisplayName)}!</h2>
      </div>
      <div>
        <h3>Welcome to Teams App Development</h3>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <iframe width="100%" height="1000px" scrolling="yes" allowTransparency={true}
                src={selectedDoc}>
                {/* <iframe width="100%" height="1000px" scrolling="yes" allowTransparency={true}
                  src={selectedDoc}>
                </iframe> */}
              </iframe>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearSelectedDoc}>Close</button>
              <button type="button" className="btn btn-primary" onClick={clearSelectedDoc}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <button type="button" onClick={openTaskModule}>Open Task Module</button>
      <div>
        <div>
          {
            docs?.map((doc: any, key: number) => <div>
              {console.log(doc)}
              {/* <a target='_blank' href={doc?.webUrl} key={key}>{doc?.name}</a> */}
              <a data-bs-toggle="modal" data-bs-target="#exampleModal" href='#' onClick={() => setHref(doc?.webUrl)} key={key}>{doc?.name}</a>
            </div>)
          }
        </div>
      </div>
    </section>
  );
}

export default Helloworld;