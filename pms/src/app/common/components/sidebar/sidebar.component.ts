/* eslint-disable no-plusplus */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UIService } from '@services/ui.service';
import { ISidebarActivePanelData, ISidebarData } from '@models/common.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  // #region class members
  sideBarData: ISidebarData[] = [];
  itFoundActive = false;
  activePanelData: ISidebarActivePanelData[] = [];
  // #endregion

  // #region constructor
  constructor(private uiService: UIService, private router: Router) { }
  // #endregion

  ngOnInit(): void {
    this.sideBarData = this.uiService.getPagePermission()?.pageAccess?.sideMenuPages || [];
    this.addIdToSideBarData(this.sideBarData, { index: 0 });
    this.updateActivePanelData(this.router.url, this.sideBarData);
  }

  // #region class members

  closeSidebar() {
    document.body.classList.toggle('open-sidebar');
  }

  setOpened(currentPanel: ISidebarData) {
    if (this.activePanelData.length < currentPanel.level || (currentPanel.level - 1 < this.activePanelData.length && currentPanel.id !== this.activePanelData[currentPanel.level - 1].id)) {
      if (currentPanel.level - 1 < this.activePanelData.length) {
        this.activePanelData.splice(currentPanel.level - 1);
      }
      this.activePanelData.push({
        id: currentPanel.id,
        level: currentPanel.level,
        menuName: currentPanel.menuName,
        pageUrl: currentPanel.pageUrl,
      });
    }
  }

  addIdToSideBarData(
    sideBarData: ISidebarData[],
    indexObject: { index: number }
  ) {
    for (let i = 0; i < sideBarData.length; i++) {
      indexObject.index += 1;
      sideBarData[i].id = indexObject.index;
      if (sideBarData[i].childrenPages.length > 0) {
        this.addIdToSideBarData(sideBarData[i].childrenPages, indexObject);
      }
    }
  }

  updateActivePanelData(url: string, sideBarData: ISidebarData[]) {
    for (let i = 0; i < sideBarData.length; i++) {
      if (!this.itFoundActive) {
        this.updateActivePanelData(url, sideBarData[i].childrenPages);
      }
      if (url.includes(sideBarData[i].pageUrl)) {
        this.itFoundActive = true;
        const sidebarActivePanel: ISidebarActivePanelData = {
          id: sideBarData[i].id,
          level: sideBarData[i].level,
          menuName: sideBarData[i].menuName,
          pageUrl: sideBarData[i].pageUrl,
        };
        this.activePanelData.unshift(sidebarActivePanel);
        return;
      }
      if (this.itFoundActive) {
        const sidebarActivePanel: ISidebarActivePanelData = {
          id: sideBarData[i].id,
          level: sideBarData[i].level,
          menuName: sideBarData[i].menuName,
          pageUrl: sideBarData[i].pageUrl,
        };
        this.activePanelData.unshift(sidebarActivePanel);
        return;
      }
    }
  }
  // #endregion
}
