import { Component, Input } from '@angular/core';
import { Hierarchy } from '@models/hierarchy.model';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrl: './hierarchy.component.css'
})
export class HierarchyComponent {
  // #region class members
  @Input() hierarchyConfig!: Hierarchy;
  @Input() loggedInUserID!: number | null;
  // #endregion

  // #region class methods
  onExpandHierarchy(data: number | undefined) {
    if (data && this.hierarchyConfig.onExpandHierarchy) {
      this.hierarchyConfig.onExpandHierarchy(data);
    }
  }
  // #endregion
}
