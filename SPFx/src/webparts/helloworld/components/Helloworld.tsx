import * as React from 'react';
import styles from './Helloworld.module.scss';
import { IHelloworldProps } from './IHelloworldProps';
import { MSGraphClient } from '@microsoft/sp-http';

const Helloworld = (props: IHelloworldProps) => {
  const {
    hasTeamsContext,
    context
  } = props;

  const [docs, setDocs] = React.useState([]);
  const [selectedDoc, setSelectedDoc] = React.useState("");

  React.useEffect(() => {
    context.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClient): void => {
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
  };

  const clearSelectedDoc = () => {
    setSelectedDoc("");
  };

  return (
    <section className={`${styles.helloworld} ${hasTeamsContext ? styles.teams : ''}`}>
      <nav className="navbar navbar-expand-lg fixed-top bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      <div>
        <h3>Welcome to Online Document Editor - SpFx</h3>
      </div>

      <div className="modal fade" id="editorModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Online Document Editor SpFx</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <iframe width="100%" height="1000px" allowTransparency={true}
                src={selectedDoc}>
              </iframe>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearSelectedDoc}>Close</button>
              <button type="button" className="btn btn-primary" onClick={clearSelectedDoc}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ul className="list-group">
        {
          docs?.map((doc: any, key: number) => <li className="list-group-item col-md-6" key={key}>
            <a className='text-decoration-none' data-bs-toggle="modal" data-bs-target="#editorModal" href='#' onClick={() => setHref(doc?.webUrl)} key={key}>{doc?.name}</a>
          </li>)
        }
        </ul>
      </div>
    </section>
  );
}

export default Helloworld;