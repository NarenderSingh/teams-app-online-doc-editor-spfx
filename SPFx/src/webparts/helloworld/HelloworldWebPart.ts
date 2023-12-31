import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'HelloworldWebPartStrings';
import Helloworld from './components/Helloworld';
import { IHelloworldProps } from './components/IHelloworldProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IHelloworldWebPartProps {
  description: string;
}

export default class HelloworldWebPart extends BaseClientSideWebPart<IHelloworldWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css');
    SPComponentLoader.loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js', {
      globalExportsName: 'bootstrap',
    }).then(($: any) => {
    });
    SPComponentLoader.loadScript('https://unpkg.com/@microsoft/teams-js@1.3.7/dist/MicrosoftTeams.min.js', {
      globalExportsName: 'teams',
    }).then(($: any) => {
    });

    // microsoftTeams.initialize();
    // var authTokenRequest = {
    //   successCallback: function (result: any) { console.log("Success: " + result); },
    //   failureCallback: function (error: any) { console.log("Error getting token: " + error); }
    // };
    // microsoftTeams.authentication.getAuthToken(authTokenRequest);

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IHelloworldProps> = React.createElement(
      Helloworld,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
