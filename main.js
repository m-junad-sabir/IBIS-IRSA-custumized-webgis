require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GroupLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/layers/support/LabelClass",
    "esri/PopupTemplate"
], function (
    Map,
    MapView,
    MapImageLayer,
    FeatureLayer,
    GroupLayer,
    LayerList,
    Home,
    Legend,
    LabelClass,
    PopupTemplate
) {
    // Helper function to create a dynamic popup template
    function createPopupTemplate(layer, fieldInfos) {
        layer.popupTemplate = new PopupTemplate({
            title: layer.title,
            content: [{
                type: "fields",
                fieldInfos: fieldInfos
            }]
        });
    }

    // Define the custom style for action buttons
    const buttonStyle = {
        cursor: "pointer",
        padding: "9px",
        fontSize: "12px",
        textAlign: "center",
        borderRadius: "2px",
        borderWidth: "0px",
        marginRight: "5px"
    };

    // Helper function to create the legend widget
    let legendWidget = null;
    function createLegendWidget(view, layer) {
        if (legendWidget) {
            legendWidget.destroy();
            view.ui.remove(legendWidget);
        }
        
        legendWidget = new Legend({
            view: view,
            layerInfos: [{
                layer: layer,
                title: layer.title
            }]
        });
        view.ui.add(legendWidget, "bottom-right");
    }

    // Label class for "Labels" action
    const labelClass = new LabelClass({
        symbol: {
            type: "text", // autocasts as new TextSymbol()
            color: "black",
            haloColor: "white",
            haloSize: 1.5,
            font: {
                family: "Noto Sans",
                size: 10,
            },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: "$feature.Name || $feature.Zone || $feature.Circle",
        },
    });

    // Helper function to toggle labels
    function setLabels(layer) {
        layer.labelsVisible = !layer.labelsVisible;
    }

    // Helper function to create and append the Calcite slider
    function createOpacitySlider(item) {
        const label = document.createElement("calcite-label");
        label.innerText = "Opacity";
        label.scale = "s";

        const slider = document.createElement("calcite-slider");
        slider.labelHandles = true;
        slider.labelTicks = true;
        slider.min = 0;
        slider.minLabel = "0";
        slider.max = 1;
        slider.maxLabel = "1";
        slider.scale = "s";
        slider.step = 0.01;
        slider.value = item.layer.opacity;

        slider.addEventListener("calciteSliderChange", () => {
            item.layer.opacity = slider.value;
        });

        label.appendChild(slider);
        return label;
    }

    // A function that executes each time a ListItem is created for a layer.
    function setLayerListActions(event) {
        const item = event.item;
        const layer = item.layer;

        // Custom panel to hold the buttons
        const panelContent = document.createElement("div");
        panelContent.classList.add("btn-group");

        // "Full Extent" button
        const fullExtentBtn = document.createElement("button");
        fullExtentBtn.innerText = "Locate";
        fullExtentBtn.onclick = () => {
            view.goTo(layer.fullExtent).catch((error) => {
                if (error.name !== "AbortError") {
                    console.error(error);
                }
            });
        };
        panelContent.appendChild(fullExtentBtn);

        // "Labels" button
        const labelsBtn = document.createElement("button");
        labelsBtn.innerText = "Labels";
        labelsBtn.onclick = () => {
            setLabels(layer);
        };
        panelContent.appendChild(labelsBtn);
        
        // "Legend" button
        const legendBtn = document.createElement("button");
        legendBtn.innerText = "Legend";
        legendBtn.onclick = () => {
            createLegendWidget(view, layer);
        };
        panelContent.appendChild(legendBtn);

        // Opacity slider panel
        const opacitySlider = createOpacitySlider(item);
        panelContent.appendChild(opacitySlider);

        item.panel = {
            content: panelContent,
            icon: "ellipsis-circle",
            title: "Layer Actions"
        };
    }

    // ~~~~~~~~~ DEFINE LAYERS ~~~~~~~~~~~~~~
    const ChashmaBarrageGroup = new GroupLayer({

    url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/0",
    title: "Chashma Barrage",
    visible: true,
    layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/1",
                title: "CJ Link Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/2",
                title: "Chashma Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/3",
                title: "Chasma",
                visible: true,
                outFields: ["*"]
            })
         ]
    });
    ////////////////////////////////////////////////////////////////
    const SulemankiHeadworksGroup = new GroupLayer({

    url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/32",
    title: "Sulemanki Headworks",
    visible: true,
    layers: [
        new FeatureLayer({
            url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/33",
            title: "Sulemanki Headworks Gauges",
            visible: true,
            outFields: ["*"]
        }),
        new FeatureLayer({
            url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/34",
            title: "Suleimanki Headworks",
            visible: true,
            outFields: ["*"]
        })
    ]
    });
    ////////////////////////////////////////////////////////////////
    const BallokiHeadworksGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/35",
        title: "Balloki Headworks",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/36",
                title: "Balloki Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/37",
                title: "Balloki",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const TrimmuHeadworksGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/41",
        title: "Trimmu Headworks",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/42",
                title: "Trimmu Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/43",
                title: "Trimmu",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    
    // ~~~~~~~~~~~ DEFINE POP-UP TEMPLATES ~~~~~~~~~~~~~~~~
    createPopupTemplate(ChashmaBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(ChashmaBarrageGroup.layers.getItemAt(1), [
    { fieldName: "Name", label: "Name" },
    { fieldName: "Layer", label: "Layer" },
    { fieldName: "Site_Id", label: "Site_Id" },
    { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(ChashmaBarrageGroup.layers.getItemAt(2), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(SulemankiHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(SulemankiHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(BallokiHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(BallokiHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(TrimmuHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(TrimmuHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);

    // Create a new Map with the defined layers
    const map = new Map({
        basemap: "satellite",
        layers: [
            TrimmuHeadworksGroup,
            BallokiHeadworksGroup,
            SulemankiHeadworksGroup,
            ChashmaBarrageGroup
        ]
    });

    // Create the MapView
    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [68, 30.6],
        zoom: 6
    });

    // Add Home and LayerList widgets
    view.ui.add(new Home({ view: view }), "top-trailing");
    view.ui.move("navigation-toggle","top-right");
    view.ui.move("zoom","top-trailing");
    
    view.when(() => {
        const layerList = new LayerList({
            view: view,
            position: "top-leading",
            "show-collapse-button": true,
            "show-heading": true,
            "show-filter": true,
            "filter-placeholder": "Filter layers",
            listItemCreatedFunction: setLayerListActions
        });
        view.ui.add(layerList, "top-leading");
    });
});