"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const category_model_1 = __importDefault(require("./category-model"));
const product_model_1 = __importDefault(require("./product-model"));
let SubCategory = class SubCategory extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], SubCategory.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SubCategory.prototype, "subCategoryName", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => category_model_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true, // optional
    }),
    __metadata("design:type", Object)
], SubCategory.prototype, "categoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => category_model_1.default),
    __metadata("design:type", category_model_1.default)
], SubCategory.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_model_1.default, { foreignKey: 'subCategoryId' }),
    __metadata("design:type", Array)
], SubCategory.prototype, "products", void 0);
SubCategory = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'subCategories',
        modelName: 'SubCategory',
        timestamps: true,
    })
], SubCategory);
exports.default = SubCategory;
