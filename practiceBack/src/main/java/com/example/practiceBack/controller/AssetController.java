package com.example.practiceBack.controller;

import com.example.practiceBack.dto.Asset;
import com.example.practiceBack.service.AssetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController (AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetService.getAllAssets();
    }

    @PostMapping
    public void addAsset(@RequestBody Asset asset) {
        assetService.addAsset(asset);
    }

    @PutMapping("/{assetSerialNumber}")
    public void updateAsset(
        @PathVariable String assetSerialNumber,
        @RequestBody Asset asset
    ) {
        asset.setAssetSerialNumber(assetSerialNumber);
        assetService.updateAsset(asset);
    }

    @DeleteMapping("/{assetSerialNumber}")
    public void deleteAsset(@PathVariable String assetSerialNumber) {
        assetService.deleteAsset(assetSerialNumber);
    }
}
