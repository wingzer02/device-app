package com.example.practiceBack.controller;

import com.example.practiceBack.dto.Asset;
import com.example.practiceBack.dto.PageResponse;
import com.example.practiceBack.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController (AssetService assetService) {
        this.assetService = assetService;
    }

    // 자산 전체 조회
    @GetMapping("/all")
    public List<Asset> getAllAssets() {
        return assetService.getAllAssets();
    }

    @GetMapping
    public PageResponse<Asset> getAssetPage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortKey,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        return assetService.getAssetsPage(page, size, sortKey, sortDir);
    }

    // 자산 단건 조회
    @GetMapping("/{assetSerialNumber}")
    public Asset getAsset(@PathVariable String assetSerialNumber) {
        return assetService.getAsset(assetSerialNumber);
    }

    // 자산 등록
    @PostMapping
    public void addAsset(@Valid @RequestBody Asset asset) {
        assetService.addAsset(asset);
    }

    // 자산 갱신
    @PutMapping("/{assetSerialNumber}")
    public void updateAsset(
        @PathVariable String assetSerialNumber,
        @Valid @RequestBody Asset asset
    ) {
        asset.setAssetSerialNumber(assetSerialNumber);
        assetService.updateAsset(asset);
    }

    // 자산 삭제
    @DeleteMapping("/{assetSerialNumber}")
    public void deleteAsset(@PathVariable String assetSerialNumber) {
        assetService.deleteAsset(assetSerialNumber);
    }
}
