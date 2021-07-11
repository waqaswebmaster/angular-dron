import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
// import {figure, show} from "@bokeh/bokehjs/build/js/lib/api/plotting";

declare var Bokeh: any;

@Component({
  selector: 'app-bokeh-chart',
  templateUrl: './bokeh-chart.component.html',
  styleUrls: ['./bokeh-chart.component.scss'],
})
export class BokehChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title: string;

  chartId: string;

  constructor() {
  }

  ngOnInit(): void {
    // this.chartId = `bokeh-chart-${Math.floor(Math.random() * 10000)}`;
    this.chartId = 'd199dc51-c663-4220-800f-a5f0d7c3a97a';
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    const x = [1, 2, 3, 4, 5];
    const y = [6, 7, 2, 4, 5];

    // const p = figure({
    //   title: 'Simple line example',
    //   x_axis_label: 'x',
    //   y_axis_label: 'y',
    // });
    //
    // // add a line renderer with legend and line thickness
    // p.line({
    //   x,
    //   y,
    //   legend_label: 'Temp.',
    //   line_width: 2,
    // } as any);
    //
    // // # show the results
    // show(p);

    // const docs_json = '{"d199dc51-c663-4220-800f-a5f0d7c3a97a":{"roots":{"references":[{"attributes":{"bottom_units":"screen","fill_alpha":{"value":0.5},"fill_color":{"value":"lightgrey"},"left_units":"screen","level":"overlay","line_alpha":{"value":1.0},"line_color":{"value":"black"},"line_dash":[4,4],"line_width":{"value":2},"plot":null,"render_mode":"css","right_units":"screen","top_units":"screen"},"id":"f795b234-3b1e-4117-aa31-bccbbaaccf71","type":"BoxAnnotation"},{"attributes":{"axis_line_color":{"value":null},"formatter":{"id":"8c794376-5b4c-42f6-bcf4-662922d47df1","type":"BasicTickFormatter"},"major_tick_line_color":{"value":null},"minor_tick_line_color":{"value":null},"plot":{"id":"6fbff9b0-a4fc-4fc1-a50e-d34f906928b2","subtype":"Figure","type":"Plot"},"ticker":{"id":"5468ade8-3979-45b4-9dd0-fbb3cab5b888","type":"BasicTicker"},"visible":null},"id":"be01b966-482b-4e6f-8c6f-8bc0373791aa","type":"LinearAxis"},{"attributes":{},"id":"f9e57a1a-b5e1-4c3f-8e0d-4789dca393ec","type":"SaveTool"},{"attributes":{"fill_color":{"value":"#6C69EB"},"height":{"value":0.5},"right":{"field":"Sales"},"y":{"field":"ID"}},"id":"4dc67234-e29e-4e53-997c-3a6b2e40d5e5","type":"HBar"},{"attributes":{},"id":"db86af55-1185-4097-839a-8d5dc01f19a2","type":"LinearScale"},{"attributes":{},"id":"538fede7-868b-4740-a75e-cb6065ac1194","type":"ResetTool"},{"attributes":{"source":{"id":"946bc6d9-32c8-4dfe-8d34-a29c7c06a242","type":"ColumnDataSource"}},"id":"4ff758a6-c013-4e17-ae69-5c039b0c9394","type":"CDSView"},{"attributes":{"callback":null,"factors":["1348","1226","1306","1268","1103","1129","1340","1470","1783","1346","1264","1387","1775","1247","1771","1770","1773","1772","1190","1733","1727","1694","1584","1503","1113","404","403","401","509","1119","1653","1467","1677","1670","1565","1391","1699","995","1235","1314","1759","1218","1336","1553","1668","1134","1493","1742","1561","1501","1567","1676","1678","1251","1664","1056","1557","1753","1602","1288","1438","1657","1681","1604","1768","1105","1750","1009","1361","1666","1259","1766","1382"]},"id":"2949c368-f95d-4a48-addb-988e5d963ff9","type":"FactorRange"},{"attributes":{},"id":"925e5c0f-b284-4614-a702-33c0ee4bcf34","type":"WheelZoomTool"},{"attributes":{"grid_line_color":{"value":null},"plot":{"id":"6fbff9b0-a4fc-4fc1-a50e-d34f906928b2","subtype":"Figure","type":"Plot"},"ticker":{"id":"5468ade8-3979-45b4-9dd0-fbb3cab5b888","type":"BasicTicker"}},"id":"b1bd251f-e88f-46f1-ac91-5ab1d74ece4b","type":"Grid"},{"attributes":{},"id":"4f69bbc9-c6df-4c64-976c-9013fddff8db","type":"CategoricalTickFormatter"},{"attributes":{"callback":null,"tooltips":"\\n    &lt;div&gt;\\n        &lt;div&gt;\\n            &lt;span style=\\"font-size: 10px;\\"&gt;Merch_Ifonafed:&lt;/span&gt;\\n            &lt;span style=\\"font-size: 15px; font-weight: bold;\\"&gt;@ID&lt;/span&gt;\\n        &lt;div&gt;\\n        \\n        &lt;div&gt;\\n            &lt;span style=\\"font-size: 10px;\\"&gt;Revenue:&lt;/span&gt;\\n            &lt;span style= font-size:15px; font-weight: bold;&gt;&amp;#x20B9;&lt;/span&gt; \\n            &lt;span style=\\"font-size: 15px; font-weight: bold;\\"&gt;@Sales{0,0.000}&lt;/span&gt;\\n        &lt;div&gt;\\n        \\n        &lt;div&gt;\\n            &lt;span style=\\"font-size: 10px;\\"&gt;Visits:&lt;/span&gt;\\n            &lt;span style=\\"font-size: 15px; font-weight: bold;\\"&gt;@Count&lt;/span&gt;            \\n        &lt;div&gt;\\n        \\n        &lt;div&gt;\\n            &lt;span style=\\"font-size: 10px;\\"&gt;Avg Val/Tr:&lt;/span&gt;\\n            &lt;span style= font-size:15px; font-weight: bold;&gt;&amp;#x20B9;&lt;/span&gt; \\n            &lt;span style=\\"font-size: 15px; font-weight: bold;\\"&gt;@AVG&lt;/span&gt;\\n\\n            \\n        &lt;div&gt;\\n        \\n        &lt;div&gt;\\n            &lt;span style=\\"font-size: 10px;\\"&gt;Mode:&lt;/span&gt;\\n            &lt;span style= font-size:15px; font-weight: bold;&gt;&amp;#x20B9;&lt;/span&gt; \\n            &lt;span style=\\"font-size: 15px; font-weight: bold;\\"&gt;@Mode&lt;/span&gt;\\n\\n        &lt;div&gt;\\n       \\n        &lt;div&gt;\\n            &lt;span style=\\"font-size: 10px;\\"&gt;Unique_Visitors:&lt;/span&gt;\\n            &lt;span style=\\"font-size: 15px; font-weight: bold;\\"&gt;@Unique_guests&lt;/span&gt;\\n\\n        &lt;/div&gt;\\n    &lt;/div&gt;\\n    "},"id":"508c69b2-507e-4091-8056-05e75b6a53bf","type":"HoverTool"},{"attributes":{},"id":"af2d3da9-5a8e-48f8-acb3-43d7d7778809","type":"HelpTool"},{"attributes":{},"id":"3de664c0-c02a-4eda-9c07-7e580557f395","type":"CategoricalScale"},{"attributes":{"axis_line_color":{"value":null},"formatter":{"id":"4f69bbc9-c6df-4c64-976c-9013fddff8db","type":"CategoricalTickFormatter"},"plot":{"id":"6fbff9b0-a4fc-4fc1-a50e-d34f906928b2","subtype":"Figure","type":"Plot"},"ticker":{"id":"89f1fa5c-f135-47df-8383-cb589af6606f","type":"CategoricalTicker"}},"id":"e9113819-fe22-4051-bbaa-c568873d85fe","type":"CategoricalAxis"},{"attributes":{"data_source":{"id":"946bc6d9-32c8-4dfe-8d34-a29c7c06a242","type":"ColumnDataSource"},"glyph":{"id":"4dc67234-e29e-4e53-997c-3a6b2e40d5e5","type":"HBar"},"hover_glyph":null,"muted_glyph":null,"view":{"id":"4ff758a6-c013-4e17-ae69-5c039b0c9394","type":"CDSView"}},"id":"9fed1d26-a3c2-4096-8c12-cca8bc423562","type":"GlyphRenderer"},{"attributes":{"below":[{"id":"be01b966-482b-4e6f-8c6f-8bc0373791aa","type":"LinearAxis"}],"left":[{"id":"e9113819-fe22-4051-bbaa-c568873d85fe","type":"CategoricalAxis"}],"outline_line_alpha":{"value":0.2},"renderers":[{"id":"be01b966-482b-4e6f-8c6f-8bc0373791aa","type":"LinearAxis"},{"id":"b1bd251f-e88f-46f1-ac91-5ab1d74ece4b","type":"Grid"},{"id":"e9113819-fe22-4051-bbaa-c568873d85fe","type":"CategoricalAxis"},{"id":"a48580a8-8254-4b66-a45c-a3e41210d5f4","type":"Grid"},{"id":"f795b234-3b1e-4117-aa31-bccbbaaccf71","type":"BoxAnnotation"},{"id":"9fed1d26-a3c2-4096-8c12-cca8bc423562","type":"GlyphRenderer"}],"title":{"id":"c23880dd-5727-4f94-9e1d-f1ecf3d2f71e","type":"Title"},"toolbar":{"id":"f380e570-a3bb-4430-9bb8-ba214afcf178","type":"Toolbar"},"x_range":{"id":"55df4eae-ccbb-4c6d-afa3-653995f8bb79","type":"DataRange1d"},"x_scale":{"id":"db86af55-1185-4097-839a-8d5dc01f19a2","type":"LinearScale"},"y_range":{"id":"2949c368-f95d-4a48-addb-988e5d963ff9","type":"FactorRange"},"y_scale":{"id":"3de664c0-c02a-4eda-9c07-7e580557f395","type":"CategoricalScale"}},"id":"6fbff9b0-a4fc-4fc1-a50e-d34f906928b2","subtype":"Figure","type":"Plot"},{"attributes":{},"id":"5468ade8-3979-45b4-9dd0-fbb3cab5b888","type":"BasicTicker"},{"attributes":{"plot":null,"text":""},"id":"c23880dd-5727-4f94-9e1d-f1ecf3d2f71e","type":"Title"},{"attributes":{"active_drag":"auto","active_inspect":"auto","active_scroll":"auto","active_tap":"auto","tools":[{"id":"883319d0-a94d-44bd-ad9d-8e7b4a393771","type":"PanTool"},{"id":"925e5c0f-b284-4614-a702-33c0ee4bcf34","type":"WheelZoomTool"},{"id":"ac6748d3-f7ae-4232-8ed3-74432a8f67ab","type":"BoxZoomTool"},{"id":"f9e57a1a-b5e1-4c3f-8e0d-4789dca393ec","type":"SaveTool"},{"id":"538fede7-868b-4740-a75e-cb6065ac1194","type":"ResetTool"},{"id":"af2d3da9-5a8e-48f8-acb3-43d7d7778809","type":"HelpTool"},{"id":"508c69b2-507e-4091-8056-05e75b6a53bf","type":"HoverTool"}]},"id":"f380e570-a3bb-4430-9bb8-ba214afcf178","type":"Toolbar"},{"attributes":{"overlay":{"id":"f795b234-3b1e-4117-aa31-bccbbaaccf71","type":"BoxAnnotation"}},"id":"ac6748d3-f7ae-4232-8ed3-74432a8f67ab","type":"BoxZoomTool"},{"attributes":{"callback":null,"column_names":["Count","AVG","ID","Sales"],"data":{"AVG":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"Count":[11,473,224,12,2522,1,3,1668,4,116,355,248,7,9,2,4,1922,1,1613,62,239,1,135,14,685,303,720,1092,1,264,1384,311,3,1680,903,80,2,337,249,207,1,271,2,1,440,1312,74,1169,3,427,1303,36,46,1002,97,438,2,2,272,1287,1205,212,6,1142,42,925,3,1130,13,692,887,166,446],"ID":["1348","1226","1306","1268","1103","1129","1340","1470","1783","1346","1264","1387","1775","1247","1771","1770","1773","1772","1190","1733","1727","1694","1584","1503","1113","404","403","401","509","1119","1653","1467","1677","1670","1565","1391","1699","995","1235","1314","1759","1218","1336","1553","1668","1134","1493","1742","1561","1501","1567","1676","1678","1251","1664","1056","1557","1753","1602","1288","1438","1657","1681","1604","1768","1105","1750","1009","1361","1666","1259","1766","1382"],"Sales":[14920,113230,50641,2400,585233,0,0,438801,900,56428,116718,89224,0,0,780,0,552609,0,389764,14688,50450,0,28240,2680,147458,89125,183097,266313,0,2094625,499393,90876,10,434509,238438,17970,290,141866,85690,47865,0,71074,320,0,89103,348101,20536,283752,0,138798,341643,8950,8451,335189,23034,125857,0,0,80885,342261,351727,52722,732,324171,11451,245051,0,370611,2310,161049,257464,41871,107453]}},"id":"946bc6d9-32c8-4dfe-8d34-a29c7c06a242","type":"ColumnDataSource"},{"attributes":{"dimension":1,"grid_line_color":{"value":null},"plot":{"id":"6fbff9b0-a4fc-4fc1-a50e-d34f906928b2","subtype":"Figure","type":"Plot"},"ticker":{"id":"89f1fa5c-f135-47df-8383-cb589af6606f","type":"CategoricalTicker"}},"id":"a48580a8-8254-4b66-a45c-a3e41210d5f4","type":"Grid"},{"attributes":{},"id":"883319d0-a94d-44bd-ad9d-8e7b4a393771","type":"PanTool"},{"attributes":{},"id":"89f1fa5c-f135-47df-8383-cb589af6606f","type":"CategoricalTicker"},{"attributes":{"callback":null},"id":"55df4eae-ccbb-4c6d-afa3-653995f8bb79","type":"DataRange1d"},{"attributes":{},"id":"8c794376-5b4c-42f6-bcf4-662922d47df1","type":"BasicTickFormatter"}],"root_ids":["6fbff9b0-a4fc-4fc1-a50e-d34f906928b2"]},"title":"Bokeh Application","version":"0.12.13"}}';
    // const render_items = [{"docid":"d199dc51-c663-4220-800f-a5f0d7c3a97a","elementid":"74705daf-2fe7-47e6-9800-0ecaf72e9708","modelid":"6fbff9b0-a4fc-4fc1-a50e-d34f906928b2"}];
    // Bokeh.embed.embed_items(docs_json, render_items);

    // console.log(Bokeh);
    // const p = figure();
    // const data = {
    //   version: Bokeh.version,
    // };
    // this.plot(p);
  }

  plot(item: any) {
    const el = document.getElementById(this.chartId);
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
    Bokeh.embed.embed_item(item, this.chartId);
  }
}
