"use strict";
(() => {
var exports = {};
exports.id = 3060;
exports.ids = [3060];
exports.modules = {

/***/ 53524:
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ 34110:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  l: () => (/* binding */ currentProfilePages)
});

;// CONCATENATED MODULE: external "@clerk/nextjs/server"
const server_namespaceObject = require("@clerk/nextjs/server");
// EXTERNAL MODULE: ./lib/db.ts
var db = __webpack_require__(37646);
;// CONCATENATED MODULE: ./lib/current-profile-pages.ts


const currentProfilePages = async (req)=>{
    const { userId } = (0,server_namespaceObject.getAuth)(req);
    if (!userId) return null;
    const profile = await db.db.profile.findUnique({
        where: {
            userId
        }
    });
    return profile;
};


/***/ }),

/***/ 37646:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   db: () => (/* binding */ db)
/* harmony export */ });
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53524);
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);

const db = globalThis.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();
if (false) {}


/***/ }),

/***/ 86256:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _lib_current_profile_pages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(34110);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(37646);


async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({
        error: "Method not allowed"
    });
    try {
        const profile = await (0,_lib_current_profile_pages__WEBPACK_IMPORTED_MODULE_0__/* .currentProfilePages */ .l)(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;
        if (!profile) return res.status(401).json({
            error: "Unauthorized"
        });
        if (!serverId) return res.status(400).json({
            error: "Server ID Missing"
        });
        if (!channelId) return res.status(400).json({
            error: "Channel ID Missing"
        });
        if (!content) return res.status(400).json({
            error: "Content Missing"
        });
        const server = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });
        if (!server) return res.status(404).json({
            message: "Server not found"
        });
        const channel = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.db.channel.findFirst({
            where: {
                id: channelId,
                serverId: serverId
            }
        });
        if (!channel) return res.status(404).json({
            message: "Channel not found"
        });
        const member = server.members.find((member)=>member.profileId === profile.id);
        if (!member) return res.status(404).json({
            message: "Member not found"
        });
        const message = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);
    } catch (error) {
        console.error("[MESSAGES_POST]", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(86256));
module.exports = __webpack_exports__;

})();